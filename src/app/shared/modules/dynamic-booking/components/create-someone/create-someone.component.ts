import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map, of, switchMap } from 'rxjs';
import { Gender } from 'src/app/proxy/enums';
import {
  FinancialSetupService,
  PatientProfileService,
} from 'src/app/proxy/services';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';
import { TosterService } from 'src/app/shared/services/toster.service';
import { FinancialSetupDto } from '../../../../../proxy/dto-models';
import { CONTROL_DATA } from '../../service/control.data.token';
import { PatientProfileSearchService } from './../../../../../proxy/services/patient-profile-search.service';
import { BookingService } from './../../service/booking.service';

@Component({
  selector: 'app-create-someone',

  templateUrl: './create-someone.component.html',
  styleUrl: './create-someone.component.scss',
})
export class CreateSomeoneComponent implements OnInit {
  createPatientForm!: FormGroup;
  profileInfo: any;
  dataLoader: boolean = false;
  sessionRole: string = '';
  userPatientList: any;
  alreadyExistPatient: any;
  formSubmitted!: boolean;
  isNewUser: boolean = false;
  isExistUser: boolean = true;
  btnLoader: boolean = false;
  createNewPatientInfo: any;
  genderList = CommonService.getEnumList(Gender);
  value: any;
  doctorData = this.controlData.config;
  serviceFeeList: FinancialSetupDto[] = [];
  patientNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(11),
    Validators.pattern(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/),
  ]);
  message = '';
  isSearchingPatient = false;
  readonly = false;
  constructor(
    @Inject(CONTROL_DATA) public controlData: any,

    private BookingService: BookingService,
    private fb: FormBuilder,
    private NormalAuth: AuthService,
    private UserinfoStateService: UserinfoStateService,
    private TosterService: TosterService,
    private PatientProfileService: PatientProfileService,
    private FinancialSetupService: FinancialSetupService,
    private PatientProfileSearchService: PatientProfileSearchService
  ) {}

  ngOnInit(): void {
    let user = this.NormalAuth.authInfo();
    this.sessionRole = user.userType;
    this.FinancialSetupService.getListByProviderIdandType(
      1,
      this.doctorData.doctorDetails.id,
      this.sessionRole
    ).subscribe((f) => {
      this.serviceFeeList = f;
    });
    if (user.id) {
      this.UserinfoStateService.getUserPatientInfo(user.id, this.sessionRole);
      this.getUser();
    }
  }

  loadForm() {
    this.createPatientForm = this.fb.group({
      // isSelf: [false, Validators.required],
      patientName: ['', Validators.required],
      patientProfileId: [''],
      age: ['', [Validators.required]],
      gender: ['1', Validators.required],
      bloodGroup: [0, Validators.required],
      patientMobileNo: [
        '',
        [
          Validators.required,
          Validators.pattern(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/),
        ],
      ],
      // patientEmail: ['' || this.profileInfo?.email || 'admin@gmail.com'],
      createdBy: [this.profileInfo.fullName, Validators.required],
      creatorEntityId: [this.profileInfo.id, Validators.required],
      creatorRole: [this.sessionRole, Validators.required],
    });
  }
  onSelectItem(item: string) {
    console.log(item);

    this.BookingService.selectedItem.update((v) => ({ ...v, [item]: true }));
  }

  getUser() {
    const id = this.NormalAuth.authInfo()?.id;
    if (!id) {
      console.error('User ID not found in auth info');
      return;
    }

    this.UserinfoStateService.getData()
      .pipe(
        switchMap((e) => {
          if (!e) {
            console.error('No profile info returned from UserinfoStateService');
            return of([]); // Return an empty array if profileInfo is unavailable
          }

          this.profileInfo = e;
          console.log('Profile info:', this.profileInfo);

          this.loadForm();

          return this.UserinfoStateService.getUserPatientData().pipe(
            map((data) => {
              console.log('User patient data:', data);
              return data?.map((item: any) => ({
                name: item.patientName,
                id: item.id,
              }));
            })
          );
        })
      )
      .subscribe(
        (res) => {
          console.log('User patient list:', res); // Debugging
          this.userPatientList = res;
        },
        (error) => {
          console.error('Error in getUser:', error);
        }
      );
  }

  // userExistCheck(status: string): void {
  //   this.createPatientForm.get('patientName')?.reset();
  //   this.createPatientForm.get('age')?.reset();
  //   this.createPatientForm.get('gender')?.reset();
  //   this.createPatientForm.get('bloodGroup')?.reset();
  //   this.createPatientForm.get('patientMobileNo')?.reset();

  //   switch (status) {
  //     case 'new-user':
  //       this.isNewUser = true;
  //       this.isExistUser = false;
  //       return;
  //     case 'exist-user':
  //       this.isNewUser = false;
  //       this.isExistUser = true;
  //       return;
  //     default:
  //       break;
  //   }
  // }

  //create new patient under user
  createNewPatient(): void {
    this.formSubmitted = true;
    this.message = '';

    if (this.isNewUser) {
      if (this.createPatientForm.valid) {
        try {
          this.btnLoader = true;
          this.PatientProfileService.create(
            this.createPatientForm.value
          ).subscribe((res) => {
            if (res.patientMobileNo) {
              this.PatientProfileSearchService.getPatientProfileByMobileNo(
                res.patientMobileNo
              ).subscribe((p) => {
                if (p.is_success) {
                  this.createPatientForm
                    .get('patientProfileId')
                    ?.setValue(p.results[0].patientProfileId);
                  console.log(p);

                  this.bookingDataToReview(p.results[0], 'new');
                } else {
                  this.TosterService.customToast(
                    'Patient not found by this number',
                    'error'
                  );
                }
              });
            }
            this.btnLoader = false;
            this.TosterService.customToast(
              'Your patient is created!',
              'success'
            );
            this.UserinfoStateService.getUserPatientInfo(
              this.profileInfo.id,
              'patient'
            );
          });
        } catch (error) {
          this.TosterService.customToast(
            'Something wrong! Please retry',
            'error'
          );
        }
      }
    } else {
      this.bookingDataToReview(this.alreadyExistPatient, 'exist');
    }
  }

  // getSinglePatientData(e: any) {
  //   if (e.target.value) {
  //     this.UserinfoStateService.getUserPatientData().subscribe((res) =>
  //       res.find((data: any) => {
  //         if (data.id == e.target.value) {
  //           this.alreadyExistPatient = data;
  //           console.log(data);

  //           this.createPatientForm.patchValue({
  //             patientProfileId: data.id,
  //             age: data.age,
  //             gender: data.gender,
  //             bloodGroup: data.bloodGroup,
  //             patientMobileNo: data.patientMobileNo,
  //             patientEmail: data.patientEmail,
  //             patientName: data.patientName,
  //             createdBy: data.createdBy,
  //             creatorEntityId: data.creatorEntityId,
  //             creatorRole: data.creatorRole,
  //           });

  //           //  this.createPatientForm.patchValue(data);
  //         }
  //         return;
  //       })
  //     );
  //   }
  // }
  bookingDataToReview(data: any, user: string) {
    console.log(data, user);

    var appointmentTime = new Date();

    var hours = appointmentTime.getHours();
    var minutes = appointmentTime.getMinutes();
    var seconds = appointmentTime.getSeconds();

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

    this.BookingService.bookingInfo.set({
      doctorProfileId: this.doctorData.doctorDetails.id,
      doctorName: this.doctorData?.doctorDetails.fullName,
      doctorCode: this.doctorData?.doctorDetails.doctorCode,
      patientProfileId: data.patientProfileId,
      patientEmail: data.patientEmail,
      patientMobileNo: data.patientMobileNo,
      patientName: data.patientName,
      patientCode: data.patientCode,
      appointmentCreatorId: this.profileInfo.id,
      appointmentDate: new Date(),
      appointmentCreatorRole: this.sessionRole,
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
          : Number(this.doctorData?.doctorDetails.displayInstantFeeAsPatient),
    });
    console.log(this.BookingService.bookingInfo, user);

    this.onSelectItem('isCreate');
  }

  searchPatientByNumber() {
    this.message = '';
    if (this.patientNumber.invalid) {
      this.patientNumber.markAllAsTouched();
      return;
    }

    if (this.patientNumber.value) {
      this.isSearchingPatient = true;
      this.PatientProfileSearchService.getPatientProfileByMobileNo(
        this.patientNumber.value
      ).subscribe({
        next: (res) => {
          if (res.is_success) {
            this.isSearchingPatient = false;
            this.readonly = true;
            let data = res.results[0];
            this.alreadyExistPatient = data;
            this.createPatientForm.patchValue({
              patientProfileId: data.patientProfileId,
              age: data.age,
              gender: data.gender,
              bloodGroup: data.bloodGroup,
              patientMobileNo: data.patientMobileNo,
              patientName: data.patientName,
              createdBy: data.createdBy,
              creatorEntityId: data.creatorEntityId,
              creatorRole: data.creatorRole,
            });
            this.isNewUser = false;
            this.message = 'Patient found. You can continue.';
          } else {
            this.isNewUser = true;
            this.readonly = false;
            this.isSearchingPatient = false;
            this.readonly = false;
            // this.TosterService.customToast(res.message as string, 'warning');
            this.createPatientForm.reset();

            this.createPatientForm
              .get('patientMobileNo')
              ?.setValue(this.patientNumber.value);
            this.createPatientForm.get('bloodGroup')?.setValue(0);
            this.createPatientForm.get('gender')?.setValue(0);

            this.createPatientForm
              .get('createdBy')
              ?.setValue(this.profileInfo.fullName);
            this.createPatientForm
              .get('creatorEntityId')
              ?.setValue(this.profileInfo.id);
            this.createPatientForm
              .get('creatorRole')
              ?.setValue(this.sessionRole);

            this.message =
              'No patient found! Please fill out the form to create one and continue.';
          }
        },
      });
    } else {
      this.message = 'Enter mobile number to search patient.';
    }
  }
}
