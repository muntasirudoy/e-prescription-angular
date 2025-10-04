import { Component, Inject, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateFilterFn } from '@angular/material/datepicker';
import { combineLatestWith, map, startWith } from 'rxjs';
import { AppointmentType, Gender } from 'src/app/proxy/enums';
import {
  AppointmentService,
  FinancialSetupService,
  PatientProfileService,
  DoctorScheduleService,
} from 'src/app/proxy/services';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DoctorScheduleStateService } from 'src/app/shared/services/states/doctors-states/doctor-schedule-state.service';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';
import { TosterService } from 'src/app/shared/services/toster.service';
import { FinancialSetupDto } from '../../../../../proxy/dto-models';
import { CONTROL_DATA } from '../../service/control.data.token';
import {
  dateFormater,
  dayFromDate,
  getDisableDate,
  max_min_Date,
} from '../../utils';
import { BookingService } from './../../service/booking.service';

@Component({
  selector: 'app-schedule',

  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent implements OnInit {
  appointmentType = CommonService.getEnumList(AppointmentType);
  genderList = CommonService.getEnumList(Gender);
  totalFee: number = 0;
  form!: FormGroup;
  hospitalList = [{ name: '', id: 0 }];
  doctorData = this.controlData.config;
  disabledDays: any;
  filterData: any;
  minDate: Date = max_min_Date().minDate;
  maxDate: Date = max_min_Date().maxDate;
  selectedFeesInfo: any;
  selectedSlot: any;
  user: any;
  sessionRole: any;
  serviceFeeList: FinancialSetupDto[] = [];

  constructor(
    private FinancialSetupService: FinancialSetupService,
    @Inject(CONTROL_DATA) public controlData: any,
    private BookingService: BookingService,
    private fb: FormBuilder,
    private AppointmentService: AppointmentService,
    private TosterService: TosterService,
    private UserinfoStateService: UserinfoStateService,
    private NormalAuth: AuthService
  ) {
    effect(() => {
      this.changeBookingState();
    });
  }

  ngOnInit(): void {
    this.loadForm();
    this.sessionRole = this.NormalAuth.authInfo()?.userType;
    let schedule = this.doctorData?.doctorScheduleInfo;
    this.disabledDays = getDisableDate(schedule);
    this.FinancialSetupService.getList().subscribe((res) => {
      this.serviceFeeList = res.filter(
        (f) => f.isActive == true && f.facilityEntityType == 1
      );
    });
    //appointment date
    const selectedItem1$: any = this.form
      .get('appointmentDate')
      ?.valueChanges.pipe(startWith(this.form.get('appointmentDate')?.value));
    let day = '';
    // select schedule(hospital)
    const selectedItem2$: any = this.form
      .get('doctorScheduleType')
      ?.valueChanges.pipe(startWith(this.form.get('doctorScheduleType')));
    //select appointment type
    const selectedItem4$: any = this.form
      .get('appointmentType')
      ?.valueChanges.pipe(startWith(this.form.get('appointmentType')?.value));

    //appointment date to schedule list (hospital)
    selectedItem1$
      .pipe(
        map((selectedItem1: any) => {
          day = dayFromDate(String(selectedItem1));
          // dateString = selectedItem1;
          const hospitals = schedule
            .filter((item: any) =>
              item.doctorScheduleDaySession.some(
                (session: any) => session.scheduleDayofWeek === day
              )
            )
            .map((item: any) => ({
              name: item.chamber ? item.chamber : item.scheduleName,
              id: item.id,
            }));
          return hospitals;
        })
      )
      .subscribe((hospitals: any) => {
        this.hospitalList = hospitals;
      });

    selectedItem1$.pipe(combineLatestWith(selectedItem2$)).subscribe({
      next: ([date, scheduleId]: any[]) => {
        if (date && scheduleId) {
          this.AppointmentService.getListOfSessionsWithWeekDayTimeSlotPatientCount(
            scheduleId,
            dateFormater(date)
          ).subscribe((res) => {
            this.filterData = res;
            this.BookingService.availAbleSlot.set(res);
            // this.DoctorScheduleStateService.sendDoctorAvailableSlotData(res);
          });
        }
        this.filterData = [];
        this.BookingService.availAbleSlot.set([]);
      },
      error: (err: any) => console.log(err),
    });

    selectedItem2$
      .pipe(combineLatestWith(selectedItem4$))
      .subscribe((data: any) => {
        if (data[1] == 0) {
          this.totalFee = 0;
          return;
        }
        const feeEntry = schedule.filter((entry: any) => {
          console.log(entry.id, data[0]);

          return entry.id === Number(data[0]);
        });
        console.log(feeEntry);
        if (feeEntry) {
          feeEntry.map((fee: any) => {
            console.log(fee);

            let fees = fee.doctorFeesSetup.find((f: any) =>
              f.appointmentType == data[1] ? f.totalFee : ''
            );
            if (!fees) {
              this.TosterService.customToast(
                'Fee not found your selected appointment type!',
                'warning'
              );
              this.totalFee = 0;
              return;
            }
            let plFeeIn: any = '';
            let agentFeeIn: any = '';
            let plFee: any = 0;
            let agentFee: any = 0;
            let calculatedPlFee: any = 0;
            let calculatedAgentFee: any = 0;

            let vatFee: any = this.serviceFeeList.find((f) => f.vat)?.vat;

            if (this.sessionRole == 'agent') {
              if (fee.consultancyType == 1) {
                agentFeeIn = this.serviceFeeList.find(
                  (f) => f.platformFacilityId == 4
                )?.externalAmountIn;
                agentFee = this.serviceFeeList.find(
                  (f) => f.platformFacilityId == 4
                )?.externalAmount;
                if (agentFeeIn == 'Percentage') {
                  calculatedAgentFee = fees.totalFee * (agentFee / 100);
                } else if (agentFeeIn == 'Flat') {
                  calculatedAgentFee = agentFee;
                }
              } else if (fee.consultancyType == 2) {
                agentFeeIn = this.serviceFeeList.find(
                  (f) => f.platformFacilityId == 5
                )?.externalAmountIn;
                agentFee = this.serviceFeeList.find(
                  (f) => f.platformFacilityId == 5
                )?.externalAmount;
                if (agentFeeIn == 'Percentage') {
                  calculatedAgentFee = fees.totalFee * (agentFee / 100);
                } else if (agentFeeIn == 'Flat') {
                  calculatedAgentFee = agentFee;
                }
              }
            }
            if (fee.consultancyType == 1) {
              plFeeIn = this.serviceFeeList.find(
                (f) => f.platformFacilityId == 1
              )?.amountIn;
              plFee = this.serviceFeeList.find(
                (f) => f.platformFacilityId == 1
              )?.amount;
              if (plFeeIn == 'Percentage') {
                calculatedPlFee = fees.totalFee * (plFee / 100);
              } else if (plFeeIn == 'Flat') {
                calculatedPlFee = plFee;
              }
            } else if (fee.consultancyType == 2) {
              plFeeIn = this.serviceFeeList.find(
                (f) => f.platformFacilityId == 2
              )?.amountIn;
              plFee = this.serviceFeeList.find(
                (f) => f.platformFacilityId == 2
              )?.amount;
              if (plFeeIn == 'Percentage') {
                calculatedPlFee = fees.totalFee * (plFee / 100);
              } else if (plFeeIn == 'Flat') {
                calculatedPlFee = plFee;
              }
            }

            let totalCharge = calculatedAgentFee + calculatedPlFee;
            let vatCharge = (vatFee / 100) * totalCharge;
            (this.totalFee = fees?.totalFee + totalCharge + vatCharge),
              (this.selectedFeesInfo = fees);
          });
        } else {
          this.TosterService.customToast(
            'Fee not found your selected appointment type!',
            'warning'
          );
        }
      });
  }

  loadForm() {
    this.form = this.fb.group({
      doctorScheduleType: ['0', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentType: ['0', Validators.required],
    });
  }

  // dateFilter = (date: Date | null): boolean => {
  //   if (!date) return false;

  //   const today = new Date();
  //   const day = date.getDay();
  //   const isToday = date.toDateString() === today.toDateString();

  //   return !isToday && !this.disabledDays.includes(day);
  // };
  dateFilter: DateFilterFn<Date | null> = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }
    const day = date.getDay();
    return !this.disabledDays.includes(day);
  };

  onDateChange(date: Date) {
    this.form.get('appointmentDate')?.setValue(date);
  }

  changeBookingState() {
    this.selectedSlot = this.BookingService.selectedSlot();
  }

  onSelectItem(item: string) {
    if (!this.selectedSlot.scheduleId) {
      this.TosterService.customToast('No slot is selected!', 'warning');
      return;
    }
    const { appointmentDate, appointmentType, doctorScheduleType } =
      this.form.value;

    console.log(appointmentDate);

    const validForm =
      appointmentType != 0 && doctorScheduleType != 0 && appointmentDate;
    if (validForm) {
      //this.isLoading = true;
      //this.formSubmitted = true;
      if (this.filterData.length <= 0) {
        this.TosterService.customToast(
          'No slot found your selected options!',
          'warning'
        );
        return;
      }
      const { scheduleId, sessionId, weekDay } = this.selectedSlot;
      const finalSchedule = this.doctorData.doctorScheduleInfo.find(
        (res: any) => res.id === scheduleId
      );

      if (finalSchedule && finalSchedule.consultancyType) {
        let plFeeIn: any = '';
        let agentFeeIn: any = '';
        let plFee: any = 0;
        let agentFee: any = 0;
        let calculatedPlFee: any = 0;
        let calculatedAgentFee: any = 0;

        let vatFee: any = this.serviceFeeList.find((f) => f.vat)?.vat;

        if (this.sessionRole == 'agent') {
          if (finalSchedule.consultancyType == 1) {
            agentFeeIn = this.serviceFeeList.find(
              (f) => f.platformFacilityId == 4
            )?.externalAmountIn;
            agentFee = this.serviceFeeList.find(
              (f) => f.platformFacilityId == 4
            )?.externalAmount;
            if (agentFeeIn == 'Percentage') {
              calculatedAgentFee =
                this.selectedFeesInfo.totalFee * (agentFee / 100);
            } else if (agentFeeIn == 'Flat') {
              calculatedAgentFee = agentFee;
            }
          } else if (finalSchedule.consultancyType == 2) {
            agentFeeIn = this.serviceFeeList.find(
              (f) => f.platformFacilityId == 5
            )?.externalAmountIn;
            agentFee = this.serviceFeeList.find(
              (f) => f.platformFacilityId == 5
            )?.externalAmount;
            if (agentFeeIn == 'Percentage') {
              calculatedAgentFee =
                this.selectedFeesInfo.totalFee * (agentFee / 100);
            } else if (agentFeeIn == 'Flat') {
              calculatedAgentFee = agentFee;
            }
          }
        }

        if (finalSchedule.consultancyType == 1) {
          plFeeIn = this.serviceFeeList.find(
            (f) => f.platformFacilityId == 1
          )?.amountIn;
          plFee = this.serviceFeeList.find(
            (f) => f.platformFacilityId == 1
          )?.amount;
          if (plFeeIn == 'Percentage') {
            calculatedPlFee = this.selectedFeesInfo.totalFee * (plFee / 100);
          } else if (plFeeIn == 'Flat') {
            calculatedPlFee = plFee;
          }
        } else if (finalSchedule.consultancyType == 2) {
          plFeeIn = this.serviceFeeList.find(
            (f) => f.platformFacilityId == 2
          )?.amountIn;
          plFee = this.serviceFeeList.find(
            (f) => f.platformFacilityId == 2
          )?.amount;
          if (plFeeIn == 'Percentage') {
            calculatedPlFee = this.selectedFeesInfo.totalFee * (plFee / 100);
          } else if (plFeeIn == 'Flat') {
            calculatedPlFee = plFee;
          }
        }

        let totalCharge = calculatedAgentFee + calculatedPlFee;
        let vatCharge = (vatFee / 100) * totalCharge;

        //this.formSubmitted = true;
        const {
          consultancyType,
          doctorChamberId,
          doctorProfileId,
          scheduleType,
          chamber,
        } = finalSchedule;

        let user: any = '';
        this.UserinfoStateService.getData().subscribe(
          (userInfo) => (user = userInfo)
        );

        this.BookingService.bookingInfo.update((v) => ({
          ...v,
          doctorChamberId,
          doctorScheduleId: scheduleId,
          doctorProfileId,
          doctorChamberName: chamber,
          doctorScheduleDaySessionId: sessionId,
          appointmentDate,
          appointmentType,
          doctorScheduleType,
          appointmentTime: '',
          doctorFeesSetupId: this.selectedFeesInfo.id,
          doctorFee: this.selectedFeesInfo.totalFee,
          agentFee: calculatedAgentFee,
          platformFee: calculatedPlFee,
          vatFee: vatCharge,
          totalAppointmentFee: (
            this.selectedFeesInfo.totalFee +
            totalCharge +
            vatCharge
          ).toFixed(2),
          consultancyType,
          scheduleType,
          weekDay,

          appointmentStatus: 1,
          appointmentPaymentStatus: 2,
          appointmentCreatorId: user?.id,
          appointmentCreatorRole: this.sessionRole,
        }));
      } else {
        this.TosterService.customToast('Please select a slot', 'warning');
        //return;
      }

      if (
        this.BookingService.bookingInfo() &&
        this.BookingService.selectedItem()
      ) {
        this.BookingService.selectedItem.update((v) => ({
          ...v,
          [item]: true,
        }));
      }
    }
  }
}
