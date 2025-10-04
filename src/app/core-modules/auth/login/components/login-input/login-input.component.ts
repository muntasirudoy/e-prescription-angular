import { OrganizationIdComponent } from './../organization-id/organization-id.component';
import {
  DoctorProfileService,
  PatientProfileService,
} from '../../../../../proxy/services';
import { UserManageAccountsService } from '../../../auth-service/user-manage-accounts.service';

import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import * as CryptoJS from 'crypto-js';

import { AuthService } from 'src/app/shared/services/auth.service';
import { USER_SECRATE } from 'src/environments/environment';
// import { SubSink } from 'subsink';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgOtpInputModule } from 'ng-otp-input';
import {
  LoginResponseDto,
  OtpResultDto,
  PatientProfileDto,
} from 'src/app/proxy/dto-models';
import { AuthService as Auth } from '../../../auth-service/auth.service';
import { OtpRequestDto } from 'src/app/proxy/soow-good/domain/service/models/otp';
import {
  SendOtpModel,
  UserSignInRequestDto,
} from 'src/app/proxy/soow-good/domain/service/models/user-info';
import { TosterService } from 'src/app/shared/services/toster.service';
import { OtpComponent } from '../../../components/otp/otp.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthCheckingComponent } from '../../../auth-checking/auth-checking.component';

// import { DoctorProfileDto, PatientProfileDto } from 'src/app/proxy/dto-models';
export interface ExtendedLoginDto {
  userName: string;
  password: string;
  otp: string;
}

const loginDto: ExtendedLoginDto = {
  userName: '',
  password: '',
  otp: '',
};

type Otp = {
  pin: number;
  showOtp: boolean;
  isLoading: boolean;
  otpError: string | undefined;
  otpSuccess: string | undefined;
};

@Component({
  selector: 'app-login-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgOtpInputModule,
    RouterModule,
    OtpComponent,
  ],
  templateUrl: './login-input.component.html',
  styleUrl: './login-input.component.scss',
})
export class LoginInputComponent implements OnInit {
  @Input() navigateURL = '';
  selectedUserType = '';
  formSubmitted: boolean = false;
  // errorMessage: string = '';
  loginForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  returnUrl!: string; //(for redirect next js application)
  // isLoading: any = false;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  key: string = USER_SECRATE; //next js application

  otp = signal<Otp>({
    pin: 0,
    showOtp: false,
    isLoading: false,
    otpError: '',
    otpSuccess: '',
  });
  btnLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private NormalAuth: AuthService,
    private UserManageAccountsService: UserManageAccountsService,
    private TosterService: TosterService,
    private PatientProfileService: PatientProfileService,
    private Auth: Auth,
    private DoctorProfileService: DoctorProfileService,
    private dialog: MatDialog,
    @Optional() private AuthDialog: MatDialogRef<AuthCheckingComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.ActivatedRoute.queryParams.subscribe((params) => {
      this.selectedUserType = params['userType'] ?? 'Patient';
    });
  }

  get formControl() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      mobileNo: [
        '',
        [
          Validators.required,
          Validators.pattern(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/),
        ],
      ],
      password: [''],
    });
  }

  onOtpChange(pin: string): void {
    if (pin.length === 4) {
      this.otp().pin = parseInt(pin);
      this.verify();
    }
  }
  sendOtp() {
    this.btnLoading = true;
    this.otp.update((p) => ({ ...p, otpError: '' }));
    let otpData: SendOtpModel = {
      userName: this.loginForm.get('mobileNo')?.value,
      roleId: this.selectedUserType,
      type: 2,
    };

    if (this.selectedUserType === 'Doctor') {
      return this.onSubmit();
    } else {
      try {
        this.UserManageAccountsService.sendOtpByRequest(otpData).subscribe({
          next: (res) => {
            if (res.is_success) {
              this.otp.update((p) => ({
                ...p,
                isLoading: false,
                showOtp: true,
              }));
            } else if (res.message) {
              console.log(res);

              this.otp.update((p) => ({
                ...p,
                isLoading: false,
                showOtp: false,
                otpError: res.message,
              }));
              this.btnLoading = false;
            } else {
              this.otp.update((p) => ({
                ...p,
                isLoading: false,
                showOtp: false,
                otpError: 'Something went worng!',
              }));
              this.btnLoading = false;
            }
          },
          error: () => {
            this.otp.update((p) => ({
              ...p,
              isLoading: false,
              showOtp: false,
              otpError: 'Failed to send otp!',
            }));
            this.btnLoading = false;
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  verify(): void {
    this.otp.update((p) => ({ ...p, isLoading: true, otpError: '' }));

    const otpRequiest: OtpRequestDto = {
      otp: this.otp().pin,
      mobileNo: this.loginForm.get('mobileNo')?.value,
    };

    this.UserManageAccountsService.verifyOtpByRequest(otpRequiest).subscribe({
      next: (otpResponse) => {
        if (otpResponse.is_success) {
          this.onSubmit();
          // if (
          //   otpResponse.results.isPolicePortalTransfer &&
          //   otpResponse.results.isVerifiedOrgCode
          // ) {
          //   this.Router.navigate([], {
          //     queryParams: { redirect: 'police' },
          //     relativeTo: this.ActivatedRoute,
          //     queryParamsHandling: 'merge',
          //   }).then(() => {
          //     this.onSubmit();
          //   });
          // } else {
          //   this.otp.update((p) => ({
          //     ...p,
          //     otpError: otpResponse.message,
          //     showOtp: true,
          //     isLoading: false,
          //   }));
          //   this.showOrganizationModal(otpResponse.results.id);
          // }
          // this.otp.update((p) => ({
          //   ...p,
          //   otpError: otpResponse.message,
          //   isLoading: false,
          // }));
          // this.onSubmit();
          // this.showOrganizationModal(otpResponse.results.id);

          //this.otp().otpSuccess = otpResponse.message;
        } else {
          this.otp.update((p) => ({
            ...p,
            otpError: otpResponse.message,
            showOtp: true,
            isLoading: false,
          }));
          // this.otp().otpError = otpResponse.message;
        }
      },
      error: (err) => {
        this.otp().otpError = 'Failed to verify OTP. Please try again.';
        this.otp().isLoading = false;
        console.error('OTP verification failed:', err);
      },
    });
  }
  goToForgotPassword() {
    this.Router.navigate(['/forgot-password'], {
      queryParams: { redirect: 'login' },
    });
  }

  showOrganizationModal(userId: string) {
    const dialog = this.dialog.open(OrganizationIdComponent, {
      data: userId,
    });
    dialog.afterClosed().subscribe((result) => {
      if (result.save) {
        this.onSubmit();
      }
    });
  }

  passwordVisibility(field: string) {
    if (field === 'password') {
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'confirmPassword') {
      this.confirmPasswordFieldType =
        this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }
  onSubmit(): void {
    this.otp.update((p) => ({
      ...p,
      otpError: '',
    }));
    const requestLogin: UserSignInRequestDto = {
      userName: this.loginForm.get('mobileNo')?.value,
      password:
        this.selectedUserType == 'Patient'
          ? 'Coppa@123'
          : this.formControl['password'].value,
      userLoginType: this.selectedUserType == 'Patient' ? 1 : 2,
    };

    try {
      this.Auth.loginApiByRequest(requestLogin).subscribe({
        next: (userInfo) => {
          if (
            userInfo.is_success &&
            userInfo.results.roleName[0] !== this.selectedUserType.toLowerCase()
          ) {
            this.otp.update((p) => ({
              ...p,
              isLoading: false,
              otpError: `You are not authenticated ${this.selectedUserType.toLowerCase()}`,
            }));
            this.btnLoading = false;
            return;
          }
          if (userInfo.is_success) {
            if (userInfo.results.roleName[0].toLowerCase() === 'doctor') {
              this.handleDoctorProfile(userInfo.results);
            }
            if (userInfo.results.roleName[0].toLowerCase() === 'patient') {
              this.handlePatientProfile(userInfo.results);
            }
          }

          if (!userInfo.is_success) {
            this.otp.update((p) => ({
              ...p,
              isLoading: false,
              otpError: userInfo.message,
            }));
            this.btnLoading = false;
            // this.TosterService.customToast('User not found', 'error');
          }
        },
        error: (errorResponse) => {
          const errorMessage =
            errorResponse.error.error_description ||
            errorResponse.error.message;
          this.btnLoading = false;
          this.TosterService.customToast(errorMessage, 'error');
        },
      });
    } catch (error: any) {
      console.log(error);

      this.btnLoading = false;
      this.TosterService.customToast(error, 'error');
    }
  }

  // TODO should work on error handeling
  handlePatientProfile(userInfo: LoginResponseDto) {
    const redirect = this.ActivatedRoute.snapshot.queryParams['redirect'];

    if (userInfo.userName) {
      this.PatientProfileService.getByUserName(userInfo.userName).subscribe(
        (patientDto: PatientProfileDto) => {
          let saveLocalStorage = {
            fullName: patientDto.fullName ?? patientDto.patientName,
            userId: patientDto.userId,
            id: patientDto.id,
            userType: userInfo.roleName[0].toLowerCase(),
          };
          this.NormalAuth.setAuthInfoInLocalStorage(saveLocalStorage);
          localStorage.setItem(
            'accessToken',
            JSON.stringify(userInfo.accessToken)
          );
          localStorage.setItem(
            'refreshToken',
            JSON.stringify(userInfo.refreshToken)
          );
          if (this.navigateURL === 'dashboard') {
            let userType = userInfo.roleName[0].toLowerCase() + '/dashboard';
            this.Router.navigate([userType], {
              state: { data: patientDto },
            });
          }
          // if (redirect) {
          //   this.Router.navigate([redirect], {
          //     state: { data: patientDto },
          //   });
          // } else {
          //   if (this.navigateURL === 'dashboard') {
          //     let userType = userInfo.roleName[0].toLowerCase() + '/dashboard';
          //     this.Router.navigate([userType], {
          //       state: { data: patientDto },
          //     });
          //   }
          // }
          this.AuthDialog.close();
          window.location.reload();
          this.otp.update((p) => ({
            ...p,
            isLoading: false,
          }));
        },
        (patientError: any) => {
          console.log(patientError);
        }
      );
    } else {
      this.otp.update((p) => ({
        ...p,
        isLoading: false,
      }));
      this.TosterService.customToast('Username not found!', 'error');
    }
  }

  handleDoctorProfile(userInfo: LoginResponseDto) {
    if (userInfo.userName) {
      this.DoctorProfileService.getByUserName(userInfo.userName).subscribe({
        next: (patientDto: PatientProfileDto) => {
          let saveLocalStorage = {
            fullName: patientDto.fullName,
            userId: patientDto.userId,
            id: patientDto.id,

            //userpc: this.encrypt(String(patientDto.mobileNo)),
            userType: userInfo.roleName[0].toLowerCase(),
          };
          this.NormalAuth.setAuthInfoInLocalStorage(saveLocalStorage);

          localStorage.setItem('access', JSON.stringify(userInfo.accessToken));
          localStorage.setItem(
            'refreshToken',
            JSON.stringify(userInfo.refreshToken)
          );
          let userType = userInfo.roleName[0].toLowerCase() + '/dashboard';
          this.Router.navigate([userType.toLowerCase()], {
            state: { data: patientDto },
          });
          this.otp.update((p) => ({
            ...p,
            isLoading: false,
          }));
          // if (redirect) {
          //   this.navigateToNextJS(redirect);
          // } else if (this.returnUrl) {
          //   this._router.navigate([this.returnUrl]);
          //   return;
          // } else {
          //   this._router.navigate([userType.toLowerCase()], {
          //     state: { data: patientDto },
          //   });
          // }
          this.NormalAuth.setOtpLoader(false);
        },
        error: (patientError: any) => {
          console.log(patientError);
        },
      });
    } else {
      this.otp.update((p) => ({
        ...p,
        isLoading: false,
      }));
      this.TosterService.customToast('Username not found!', 'error');
    }
  }

  updateQueryParam(userType: string) {
    const queryParams =
      userType !== '' ? { userType: userType } : { userType: null };
    this.Router.navigate([], {
      relativeTo: this.ActivatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  backToPrevious() {
    this.updateQueryParam('');
  }
}
