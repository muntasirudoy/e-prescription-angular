import { DoctorScheduleDaySessionService } from './../../../proxy/services/doctor-schedule-day-session.service';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DoctorProfileDto, DoctorScheduleDto } from 'src/app/proxy/dto-models';
import { TosterService } from 'src/app/shared/services/toster.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { DynamicBookingComponent } from '../dynamic-booking/dynamic-booking.component';
import { DoctorScheduleService } from './../../../proxy/services/doctor-schedule.service';
import {
  BookingService,
  initBooking,
} from './../dynamic-booking/service/booking.service';

@Component({
  selector: 'app-doctor-card',
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.scss'],
})
export class DoctorCardComponent implements OnInit {
  @Input() doctorDetails!: any;

  doctorScheduleList: DoctorScheduleDto[] = [];
  isLoading: boolean = false;
  isAuthUser: any;
  userType: any;
  doctorPicurl: any;
  public picUrl = `${environment.apis.default.url}/`;
  defaultImage: any;
  isScheduleChamber!: boolean;
  isScheduleOnline!: boolean;
  scheduleList!: DoctorScheduleDto[];
  constructor(
    public dialog: MatDialog,
    private DoctorScheduleService: DoctorScheduleService,
    private DoctorScheduleDaySessionService: DoctorScheduleDaySessionService,
    private router: Router,
    private TosterService: TosterService,
    private NormalAuth: AuthService,
    private BookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.isAuthUser = this.NormalAuth.authInfo();

    if (this.isAuthUser != null) {
      this.userType = this.isAuthUser.userType;
    }
    const prePaths: string = this.doctorDetails.profilePic || '';
    const re = /wwwroot/gi;
    const profilePic = prePaths?.replace(re, '');

    if (profilePic) {
      this.doctorPicurl = this.picUrl + profilePic;
    } else {
      this.doctorPicurl = '';
    }
    if (this.doctorDetails.id) {
      this.DoctorScheduleService.getDetailsScheduleListByDoctorId(
        this.doctorDetails.id
      ).subscribe((res) => {
        res.map((schedule) => {
          if (schedule.consultancyTypeName == 'Chamber') {
            this.isScheduleChamber = true;
          }
          if (schedule.consultancyTypeName == 'Online') {
            this.isScheduleOnline = true;
          }
        });
      });
    }

    //this.doctorPicurl = this.picUrl + this.doctorDetails.profilePic;
  }

  openDialog(): void {
    // if (!this.isAuthUser) {
    //   this.router.navigate(['/login'])
    //   return
    // }

    this.isLoading = true;
    this.BookingService.selectedItem.set(initBooking);
    if (this.doctorDetails.id) {
      this.DoctorScheduleService.getDetailsScheduleListByDoctorId(
        this.doctorDetails.id
      ).subscribe((res) => {
        this.isLoading = false;

        if (res?.length > 0 && this.doctorDetails) {
          this.dialog
            .open(DynamicBookingComponent, {
              maxWidth: 600,
              minWidth: 320,
              maxHeight: '100vh',
              data: {
                doctorDetails: {
                  ...this.doctorDetails,
                  profilePic: this.doctorPicurl,
                },
                doctorScheduleInfo: res,
                userAccess:
                  this.isAuthUser?.userType == 'doctor' ? false : true,
                isAuthUser: this.isAuthUser?.id ? true : false,
                isSchedule:
                  this.isScheduleChamber || this.isScheduleOnline
                    ? true
                    : false,
                isInstant: this.doctorDetails?.isOnline,
              },
            })
            .afterClosed()
            .subscribe((result) => {
              this.BookingService.selectedItem.set(initBooking);
            });
        } else {
          this.isLoading = false;
          this.TosterService.customToast(
            `No Details/Schedule found`,
            'warning'
          );
        }
      });
    } else {
      this.isLoading = false;
      this.TosterService.customToast(`No Details/Schedule found`, 'warning');
    }
  }
  goToProfile(path: string) {
    this.router.navigate([`/search/doctors/${this.doctorDetails.id}`]);
  }

  onClickConsultNow(details: {}) {}
}
