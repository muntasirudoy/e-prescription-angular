import { Component, EventEmitter, Output, effect } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppointmentType } from 'src/app/proxy/enums';
import { EkPayInputDto, SslCommerzInputDto } from 'src/app/proxy/input-dto';
import {
  AppointmentService,
  EkPayService,
  SslCommerzService,
} from 'src/app/proxy/services';
import { ListItem } from 'src/app/shared/model/common-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { TosterService } from 'src/app/shared/services/toster.service';
import { DynamicBookingComponent } from '../../dynamic-booking.component';
import { BookingService } from './../../service/booking.service';

@Component({
  selector: 'app-review',

  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
})
export class ReviewComponent {
  bookingInfo: any;
  @Output() gotToBack = new EventEmitter<any>();
  //SSLCommerz
  sslInputDto = {
    applicantCode: '',
    examFee: 100,
    serviceCharge: 0,
    customAmount: 10,
    isCustomAmount: false,
  };
  hasValidCode = false;
  isSchedule = false;
  isChamber = false;
  sslCInputDto: SslCommerzInputDto = {} as SslCommerzInputDto;
  loading: boolean = false;
  appointmentType: ListItem[];
  userType!: string;

  constructor(
    private ToasterService: TosterService,
    private AppointmentService: AppointmentService,
    private AuthService: AuthService,
    private sslCommerzService: SslCommerzService, //private sslCommerzService: PaymentService
    private ekPayService: EkPayService, //private sslCommerzService: PaymentService
    private _router: Router,
    public dialogRef: MatDialogRef<DynamicBookingComponent>,
    private BookingService: BookingService
  ) {
    this.appointmentType = CommonService.getEnumList(AppointmentType);
    // effect(() => {});
  }
  ngOnInit(): void {
    this.userType = this.AuthService.authInfo().userType;
    this.bookingInfo = this.BookingService.bookingInfo();
    this.isSchedule = this.BookingService.selectedItem()?.isSchedule;
    this.isChamber = this.bookingInfo.consultancyType == 1 ? true : false;

    console.log(this.bookingInfo);
  }

  createAppointmentAndPayment(type: number) {
    this.loading = true;

    try {
      this.AppointmentService.create({
        ...this.bookingInfo,
        chamberPaymentType: type,
        appointmentStatus:
          type == 2 || this.bookingInfo.totalAppointmentFee === 0 ? 2 : 1,
      }).subscribe({
        next: (res) => {
          if (res.totalAppointmentFee && res.chamberPaymentType == 1) {
            this.payWithSslCommerz(res.appointmentCode),
              localStorage.setItem(
                'patientAppointmentCode',
                JSON.stringify(res.appointmentCode)
              );
          } else {
            localStorage.setItem(
              'patientAppointmentCode',
              JSON.stringify(res.appointmentCode)
            );
            this._router.navigate([
              type == 2 ? '/appointment-success' : '/payment-success',
            ]);
            this.dialogRef.close();
          }
        },
        error: (err) => {
          console.log(err);
          this.ToasterService.customToast(
            String(err.error.error.message),
            'error'
          ),
            (this.loading = false);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  payWithSslCommerz(appointmentCode: any): void {
    if (this.bookingInfo) {
      const sslCommerzInputDto: SslCommerzInputDto = {} as SslCommerzInputDto;
      sslCommerzInputDto.applicationCode = appointmentCode;
      sslCommerzInputDto.totalAmount = String(
        this.bookingInfo.totalAppointmentFee
      );

      sslCommerzInputDto.transactionId = '';
      this.sslCommerzService.initiatePayment(sslCommerzInputDto).subscribe({
        next: (response) => {
          console.log(response);
          if (
            response &&
            response.status === 'SUCCESS' &&
            response.gatewayPageURL
          ) {
            window.location.href = response.gatewayPageURL;
            this.loading = false;
          } else {
            this.loading = false;
            this.ToasterService.customToast(String(response.status), 'error');
          }
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
          this.ToasterService.customToast(
            String(err.error.error.message),
            'error'
          );
        },
      });
    } else {
      this.loading = false;
      this.ToasterService.customToast('Booking info not found', 'error');
    }
  }

  payWithEkpay(appointmentCode: any): void {
    if (this.bookingInfo) {
      const ekpayInputDto: EkPayInputDto = {} as EkPayInputDto;
      ekpayInputDto.applicationCode = appointmentCode;
      ekpayInputDto.totalAmount = String(this.bookingInfo.totalAppointmentFee);
      ekpayInputDto.transactionId = '';
      this.ekPayService.initiatePayment(ekpayInputDto).subscribe({
        next: (response) => {
          if (
            response &&
            response.status === '1000' &&
            response.gatewayPageURL
          ) {
            window.location.href = response.gatewayPageURL;
            this.loading = false;
          } else {
            this.loading = false;
            this.ToasterService.customToast(String(response.message), 'error');
          }
        },
        error: (err) => {
          this.loading = false;
          this.ToasterService.customToast(
            String(err.error.error.message),
            'error'
          );
        },
      });
    } else {
      this.loading = false;
      this.ToasterService.customToast('Booking info not found', 'error');
    }
  }
  getDayOfWeek(date: Date) {
    date = new Date(date);
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return daysOfWeek[date.getDay()];
  }
}
