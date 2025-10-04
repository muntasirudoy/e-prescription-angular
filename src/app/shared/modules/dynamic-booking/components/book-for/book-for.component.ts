import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';
import { CONTROL_DATA } from '../../service/control.data.token';
import { BookingService } from './../../service/booking.service';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import {
  PatientProfileService,
  FinancialSetupService,
} from 'src/app/proxy/services';
import { FinancialSetupDto } from '../../../../../proxy/dto-models';

@Component({
  selector: 'app-book-for',
  templateUrl: './book-for.component.html',
  styleUrl: './book-for.component.scss',
})
export class BookForComponent implements OnInit {
  user: any;
  doctorData = this.controlData.config;
  sessionRole: any;
  serviceFeeList: FinancialSetupDto[] = []; // = this.doctorData?.serviceFeeList;
  constructor(
    @Inject(CONTROL_DATA) public controlData: any,
    private BookingService: BookingService,
    private UserinfoStateService: UserinfoStateService,
    private NormalAuth: AuthService,
    private PatientProfileService: PatientProfileService,
    private FinancialSetupService: FinancialSetupService
  ) {}

  ngOnInit(): void {
    this.sessionRole = this.NormalAuth.authInfo()?.userType;
    this.FinancialSetupService.getListByProviderIdandType(
      1,
      this.doctorData.doctorDetails.id,
      this.sessionRole
    ).subscribe((f) => {
      this.serviceFeeList = f;
    });
  }

  onSelectItem(item: string) {
    var appointmentTime = new Date();
    var hours = appointmentTime.getHours();
    var minutes = appointmentTime.getMinutes();
    var seconds = appointmentTime.getSeconds();
    if (item === 'isSelf') {
      let plFeeIn: any = '';
      let agentFeeIn: any = '';
      let plFee: any = 0;
      let agentFee: any = 0;
      let indProdiverFee: any;
      let providerfee: any = 0;
      let calculatedPlFee: any = 0;
      let calculatedAgentFee: any = 0;

      let vatFee: any = this.serviceFeeList.find((f) => f.vat)?.vat;

      if (this.sessionRole == 'patient') {
        plFeeIn = this.serviceFeeList.find(
          (f) => f.platformFacilityId == 3
        )?.amountIn;
        plFee = this.serviceFeeList.find(
          (f) => f.platformFacilityId == 3
        )?.amount;
        providerfee = this.serviceFeeList.find(
          (f) => f.platformFacilityId == 3
        )?.providerAmount;

        if (plFeeIn == 'Percentage') {
          calculatedPlFee = providerfee * (plFee / 100);
        } else if (plFeeIn == 'Flat') {
          calculatedPlFee = plFee;
        }
      } else if (this.sessionRole == 'agent') {
        plFeeIn = this.serviceFeeList.find(
          (f) => f.platformFacilityId == 6
        )?.amountIn;
        plFee = this.serviceFeeList.find(
          (f) => f.platformFacilityId == 6
        )?.amount;
        agentFeeIn = this.serviceFeeList.find(
          (f) => f.platformFacilityId == 6
        )?.externalAmountIn;
        agentFee = this.serviceFeeList.find(
          (f) => f.platformFacilityId == 6
        )?.amount;
        providerfee = this.serviceFeeList.find(
          (f) => f.platformFacilityId == 6
        )?.providerAmount;

        if (plFeeIn == 'Percentage') {
          calculatedPlFee = providerfee * (plFee / 100);
        } else if (plFeeIn == 'Flat') {
          calculatedPlFee = plFee;
        }

        if (agentFeeIn == 'Percentage') {
          calculatedAgentFee = providerfee * (agentFee / 100);
        } else if (agentFeeIn == 'Flat') {
          calculatedAgentFee = agentFee;
        }
      }

      let totalCharge = calculatedAgentFee + calculatedPlFee;
      let vatCharge = (vatFee / 100) * totalCharge;

      this.UserinfoStateService.getData().subscribe(
        (userInfo) => (this.user = userInfo)
      );
      this.BookingService.bookingInfo.set({
        doctorProfileId: this.doctorData.doctorDetails.id,
        doctorName: this.doctorData?.doctorDetails.fullName,
        doctorCode: this.doctorData?.doctorDetails.doctorCode,
        patientProfileId: this.user?.id,
        patientEmail: this.user?.email,
        patientMobileNo: this.user?.mobileNo,
        patientName: this.user?.fullName,
        patientCode: this.user?.patientCode,
        appointmentCreatorId: this.user?.id,
        appointmentDate: new Date(),
        appointmentCreatorRole:
          this.sessionRole == 'patient' ? 'patient' : 'agent',
        appointmentTime: String(hours + ':' + minutes + ':' + seconds),
        appointmentStatus: 1,
        appointmentPaymentStatus: 2,
        doctorFee: providerfee,
        doctorChamberName: 'Online',
        agentFee: calculatedAgentFee,
        platformFee: calculatedPlFee,
        vatFee: vatCharge,
        totalAppointmentFee:
          this.sessionRole == 'patient'
            ? Number(this.doctorData?.doctorDetails.displayInstantFeeAsPatient)
            : this.sessionRole == 'agent'
            ? Number(this.doctorData?.doctorDetails.displayInstantFeeAsAgent)
            : 0,
      });
      let obj = {
        id: this.user?.id,
        patientName: this.user.fullName,
        patientCode: this.user.patientCode,
        patientEmail: this.user.email ? this.user.email : 'admin@gmail.com',
        patientMobileNo: this.user.mobileNo,
      };
      this.BookingService.selectedItem.update((v) => ({
        ...v,
        [item]: true,
        ...obj,
      }));
      // this.PatientProfileService.update(obj).subscribe((res) => {
      //   this.BookingService.selectedItem.update((v) => ({
      //     ...v,
      //     [item]: true,
      //   }));
      // });
    } else {
      this.BookingService.selectedItem.update((v) => ({ ...v, [item]: true }));
    }
  }
}

// this.BookingService.patientForBooking.update(() => ({
//   patientCode: this.user?.patientCode,
//   patientEmail: this.user?.email,
//   patientName: this.user?.fullName,
//   patientProfileId: this.user?.id,
//   patientMobileNo: this.user?.mobileNo,
// }));
