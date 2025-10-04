import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterModel } from 'src/app/proxy/dto-models';
import { AppointmentService } from 'src/app/proxy/services';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-video-consultation',
  templateUrl: './video-consultation.component.html',
  styleUrl: './video-consultation.component.scss',
})
export class VideoConsultationComponent implements OnInit {
  doctorId: any;
  totalCount: any;
  appointmentList: any;
  dataLoading!: boolean;
  skelton!: boolean;
  filterModel: FilterModel = {
    offset: 0,
    limit: 0,
    pageNo: 0,
    pageSize: 10,
    sortBy: 'name',
    sortOrder: 'asc',
    isDesc: false,
  };
  constructor(
    private NormalAuth: AuthService,
    private AppointmentService: AppointmentService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.doctorId = this.NormalAuth.authInfo().id;
    this.AppointmentService.getAppointmentListForDoctorWithSearchFilter(
      this.doctorId,
      {},
      this.filterModel
    ).subscribe({
      next: (res) => {
        this.appointmentList = res.result;
        this.totalCount = res.count;
        this.dataLoading = false;
        this.skelton = false;
      },
      error: (err) => {
        console.log(err);
        this.dataLoading = false;
        this.skelton = false;
      },
    });

    // combineLatest([
    //   this.AppointmentService.getAppointmentListForDoctorWithSearchFilter(
    //     this.doctorId,
    //     {},
    //     this.filterModel
    //   ),
    //   this.AppointmentService.getAppointmentCountForDoctorWithSearchFilter(
    //     this.doctorId,
    //     {}
    //   ),
    // ])
    //   .pipe(
    //     map(([buildingResponse, countResponse]) => {
    //       // Sorting appointments by date in descending order (recent to older)
    //       buildingResponse.sort(
    //         (a, b) =>
    //           new Date(String(b.appointmentDate)).getTime() -
    //           new Date(String(a.appointmentDate)).getTime()
    //       );
    //       return { buildingResponse, countResponse };
    //     })
    //   )
    //   .subscribe(
    //     ({ buildingResponse, countResponse }) => {
    //       this.totalCount = countResponse;
    //       this.appointmentList = buildingResponse;
    //       this.dataLoading = false;
    //       this.skelton = false;
    //     },
    //     (error) => {
    //       console.log(error);
    //       this.dataLoading = false;
    //       this.skelton = false;
    //     }
    //   );
  }
  goToJoinCall(apt: any) {
    let username = apt.doctorName;
    const client = 'doctor';
    const aptCode = apt.appointmentCode;
    this.updateQueryParam({ username, client, aptCode });
  }

  updateQueryParam(params: {
    username: string;
    client: string;
    aptCode: string;
  }) {
    this.router.navigate(['/doctor/video-consultation/join-call'], {
      relativeTo: this.ActivatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
