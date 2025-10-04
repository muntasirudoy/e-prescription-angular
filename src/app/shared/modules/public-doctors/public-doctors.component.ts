import {
  Component,
  Input,
  OnInit,
  HostListener,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import {
  DoctorProfileService,
  SpecializationService,
} from 'src/app/proxy/services';
import { FilterInputModel } from './../../utils/models/models';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import {
  DataFilterModel,
  DoctorProfileDto,
  FilterModel,
} from 'src/app/proxy/dto-models';
import { ConsultancyType } from 'src/app/proxy/enums';
import { SubSink } from 'subsink';
import { ListItem } from '../../model/common-model';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-public-doctors',
  templateUrl: './public-doctors.component.html',
  styleUrls: ['./public-doctors.component.scss'],
})
export class PublicDoctorsComponent implements OnInit, AfterViewInit {
  totalCount: any = 0;

  doctorList: DoctorProfileDto[] = [];
  dataLoading: boolean = true;
  consultancyType: ListItem[] = CommonService.getEnumList(ConsultancyType);
  @Input() from!: string;
  subscriptions: Subscription[] = [];
  filterInput!: FilterInputModel;
  filter!: FormGroup;
  noDataAvailable: boolean = false;
  subs = new SubSink();
  doctorFilterDto: DataFilterModel = {} as DataFilterModel;

  filterModel: FilterModel = {
    offset: 0,
    limit: 0,
    pageNo: 0,
    pageSize: 6,
    sortBy: 'name',
    sortOrder: 'asc',
    isDesc: false,
  };
  search!: string;

  @ViewChildren('doctorItem') doctorItems!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private SpecializationService: SpecializationService,
    private DoctorProfileService: DoctorProfileService,
    private route: ActivatedRoute
  ) {
    this.filter = this.fb.group({});
  }
  // todo
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.filterInput = {
      fields: {
        searchField: {
          formControlName: 'search',
        },
        filterField: [
          {
            label: 'Consultancy Type',
            fieldType: 'select',
            formControlName: 'consultancy',
            options: CommonService.getEnumList(ConsultancyType),
          },
          {
            label: 'Specialization',
            fieldType: 'select',
            formControlName: 'specialization',
            options: [],
          },
        ],
      },
    };

    const specialitySubscription =
      this.SpecializationService.getListFiltering().subscribe({
        next: (res) => {
          this.filterInput = {
            fields: {
              searchField: {
                formControlName: 'search',
              },
              filterField: [
                {
                  label: 'Consultancy Type',
                  fieldType: 'select',
                  formControlName: 'consultancy',
                  options: this.consultancyType,
                },
                {
                  label: 'Specialization',
                  fieldType: 'select',
                  formControlName: 'specialization',
                  options: res.map((l: any) => {
                    return { id: l.id, name: l.specializationName };
                  }),
                },
              ],
            },
          };
        },
        complete: () => {
          specialitySubscription.unsubscribe();
        },
      });

    this.subscriptions.push(specialitySubscription);

    this.route.queryParams.subscribe((params) => {
      const name = params['doctorname']
        ? params['doctorname']
        : params['patientname']
        ? params['patientname']
        : undefined;
      const consultancyType = params['consultancyType'];
      const specialization = params['specialization'];
      this.search = name;

      if (consultancyType !== 'All' || name || specialization) {
        this.selectedFilterData({
          consultancy: consultancyType,
          name: name,
          specialization: specialization,
        });
      } else {
        this.selectedFilterData({
          consultancy: '',
          name: '',
          specialization: '',
        });
      }
    });
  }
  ngAfterViewInit(): void {
    this.scrollToNewData();
  }
  // @HostListener('window:scroll', [])
  onClickMore(): void {
    const totalExpectedItems =
      (this.filterModel.pageNo + 1) * this.filterModel.pageSize;
    if (
      this.doctorList.length >= totalExpectedItems &&
      this.doctorList.length < this.totalCount
    ) {
      this.filterModel.pageNo++;
      this.loadMoreDoctors();
    }
  }
  scrollToNewData(): void {
    setTimeout(() => {
      const doctorItemsArray = this.doctorItems.toArray();
      if (doctorItemsArray.length > 0) {
        const newDoctor = doctorItemsArray[doctorItemsArray.length - 1];
        if (newDoctor && newDoctor.nativeElement) {
          const offsetTop = newDoctor.nativeElement.offsetTop;
          window.scrollTo({
            top: this.search ? 0 : offsetTop - 500,
            behavior: 'smooth',
          });
        }
      }
    }, 0);
  }
  private loadMoreDoctors(): void {
    // this.dataLoading = true;
    this.selectedFilterData({
      consultancy: this.doctorFilterDto.consultancyType,
      name: this.doctorFilterDto.name,
      specialization: this.doctorFilterDto.specializationId,
    });
  }

  selectedFilterData(data: any) {
    this.dataLoading = true;
    const { consultancy, specialization, name } = data;
    this.doctorFilterDto.consultancyType = consultancy;
    this.doctorFilterDto.name = name;
    this.doctorFilterDto.specializationId = specialization;

    this.filterModel.limit = this.filterModel.pageSize;
    this.filterModel.offset =
      this.filterModel.pageNo * this.filterModel.pageSize;

    this.subs.sink = combineLatest([
      this.DoctorProfileService.getDoctorListFilter(
        this.doctorFilterDto,
        this.filterModel
      ),
      this.DoctorProfileService.getDoctorsCountByFilters(this.doctorFilterDto),
    ]).subscribe(
      ([buildingResponse, countResponse]) => {
        this.totalCount = countResponse;

        this.dataLoading = false;
        if (this.doctorList.length) {
          this.scrollToNewData();
        }

        if (this.filterModel.pageNo === 0) {
          this.doctorList = buildingResponse;
        } else {
          this.doctorList = [...this.doctorList, ...buildingResponse]; // Append data
        }

        if (buildingResponse.length === 0) {
          this.dataLoading = true;
        }
      },
      (error) => {
        console.log(error);
        this.dataLoading = false;
      }
    );
  }
}
