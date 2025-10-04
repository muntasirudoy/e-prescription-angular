import { TosterService } from './../../../shared/services/toster.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  DoctorProfileService,
  PatientProfileService,
  UserAccountsService,
} from '../../../proxy/services';
import { SubSink } from 'subsink';
import {
  DoctorProfileDto,
  LoginDto,
  LoginResponseDto,
  PatientProfileDto,
} from '../../../proxy/dto-models';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppAuthService } from '../../../auth-services/app-auth.service';
import { UserProfile } from '../../../auth-models/user.model';
import { throwError, catchError } from 'rxjs';
import { CustomValidators } from 'src/app/shared/utils/auth-helper';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment, serviceBaseUrl } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-service-login',

  templateUrl: './service-login.component.html',
  styleUrl: './service-login.component.scss',
})
export class ServiceLoginComponent {
  defaultAuth: any = {
    mobileNo: '',
    password: '',
  };
  formSubmitted: boolean = false;
  errorMessage: string = '';
  loginForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  loginDto: LoginDto = {} as LoginDto;
  hasError: boolean = false;
  returnUrl!: string;
  subs = new SubSink();
  isLoading: any = false;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  changePasswordShow: boolean = false;
  resetModalShow: boolean = false;
  resetLoading: boolean = false;
  loginResponse: any;
  resetFormSubmitted: boolean = false;
  resetPasswordFieldType = 'password';
  resetConfPasswordFieldType = 'password';

  constructor(
    private authService: UserAccountsService,
    private appAuthService: AppAuthService,
    private oAuthService: OAuthService,
    private doctorProfileService: DoctorProfileService,
    private PatientProfileService: PatientProfileService,
    private fb: FormBuilder,
    private _router: Router,
    private ActivatedRoute: ActivatedRoute,
    private ToasterService: TosterService,
    private NormalAuth: AuthService,
    private sanitizer: DomSanitizer,
    private UserAccountsService: UserAccountsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  get formControl() {
    return this.loginForm.controls;
  }
  goToForgotPassword() {
    this._router.navigate(['/forgot-password'], {
      queryParams: { redirect: 'login' },
    });
  }
  initForm() {
    this.loginForm = this.fb.group({
      mobileNo: [
        this.defaultAuth.mobileNo,
        [
          Validators.required,
          Validators.pattern(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/),
        ],
      ],

      password: [this.defaultAuth.password, Validators.required],
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
    const redirect = this.ActivatedRoute.snapshot.queryParams['redirect'];

    this.formSubmitted = true;

    if (!this.loginForm.valid && !this.loginForm.touched) {
      this.ToasterService.customToast(
        'Please fill in all required fields',
        'warning'
      );
      this.isLoading = false;
      return;
    } else {
      if (this.loginForm.invalid) {
        this.isLoading = false;
        return;
      }

      this.formSubmitted = false;
      this.isLoading = true;
      let userType = '';
      this.errorMessage = '';
      this.hasError = false;
      const username = this.formControl['mobileNo'].value;
      const password = this.formControl['password'].value;
      this.oAuthService.oidc = false;
      this.loginDto.userName = username;
      this.loginDto.email = '';
      this.loginDto.password = password;
      this.loginDto.rememberMe = false;

      try {
        this.appAuthService.isLoadingSubject.next(true);
        this.oAuthService
          .fetchTokenUsingPasswordFlowAndLoadUserProfile(username, password)
          .then((userInfo: any) => {
            console.log(userInfo);

            if (userInfo && userInfo?.info?.role !== 'Agent') {
              const userModel = this.appAuthService.createUserModel(userInfo);
              var un = username.split('@')[0];
              this.authService
                .loginByUserDto(this.loginDto)
                .subscribe((loginResponse: LoginResponseDto) => {
                  this.loginResponse = loginResponse;
                  if (
                    this.loginResponse.message.includes(
                      'User Name Or Password is not correct !'
                    )
                  ) {
                    this.ToasterService.customToast(
                      String(this.loginResponse.message),
                      'warning'
                    );
                    this.isLoading = false;
                    return;
                  }
                  if (
                    loginResponse.success &&
                    loginResponse.roleName[0] == 'Doctor'
                  ) {
                    this.isLoading = false;
                    this.subs.sink = this.doctorProfileService
                      .getByUserName(
                        loginResponse.userName ? loginResponse.userName : ''
                      )
                      .subscribe(
                        (doctorDto: DoctorProfileDto) => {
                          let saveLocalStorage = {
                            identityNumber: doctorDto.identityNumber,
                            fullName: doctorDto.fullName,
                            bmdcRegNo: doctorDto.bmdcRegNo,
                            isActive: doctorDto.isActive,
                            userId: doctorDto.userId,
                            id: doctorDto.id,
                            specialityId: doctorDto.specialityId,
                            profileStep: doctorDto.profileStep,
                            createFrom: doctorDto.createFrom,
                            userType: loginResponse.roleName
                              .toString()
                              .toLowerCase(),
                          };
                          this.NormalAuth.setAuthInfoInLocalStorage(
                            saveLocalStorage
                          );
                          if (
                            doctorDto.profileStep == 1 ||
                            doctorDto.profileStep == 2
                          ) {
                            userType = '/signup';
                            //this._router.navigate(['/signup']);
                          } else {
                            if (redirect) {
                              this.navigateToNextJS(redirect);
                            } else {
                              this.navigateToNextJS('/');
                            }
                          }
                        },
                        (doctorError: any) => {
                          // Handle DoctorProfile service error

                          this.handleProfileError(doctorError);
                        }
                      );
                  } else if (
                    loginResponse.success &&
                    loginResponse.roleName[0] == 'Patient'
                  ) {
                    this.isLoading = false;
                    this.subs.sink = this.PatientProfileService.getByUserName(
                      loginResponse.userName ? loginResponse.userName : ''
                    ).subscribe(
                      (patientDto: PatientProfileDto) => {
                        let saveLocalStorage = {
                          fullName: patientDto.fullName,
                          userId: patientDto.userId,
                          id: patientDto.id,
                          userType: loginResponse.roleName
                            .toString()
                            .toLowerCase(),
                        };
                        this.NormalAuth.setAuthInfoInLocalStorage(
                          saveLocalStorage
                        );
                        let userType =
                          loginResponse.roleName.toString() + '/dashboard';

                        if (redirect) {
                          this.navigateToNextJS(redirect);
                        } else {
                          this.navigateToNextJS('/');
                        }
                      },
                      (patientError: any) => {
                        // Handle PatientProfile service error
                        this.handleProfileError(patientError);
                      }
                    );
                  } else {
                    this.hasError = true;
                    this.ToasterService.customToast(
                      loginResponse.message ? loginResponse.message : ' ',
                      'error'
                    );
                    this.isLoading = false;
                  }
                });
            }
            if (userInfo?.info.role === 'Agent') {
              this.hasError = true;
              this.isLoading = false;
              this.errorMessage =
                'You are a Agent!. Please login from Agent portal.';
            }
          })
          .catch((errorResponse) => {
            this.hasError = true;
            this.appAuthService.isLoadingSubject.next(false);
            this.errorMessage =
              errorResponse.error.error_description ||
              errorResponse.error.error;
            this.isLoading = false;
          });
      } catch (error: any) {
        this.hasError = true;
        if (error.message === "'tokenEndpoint' should not be null") {
          this.errorMessage = 'Identity server is not running';
        }
      }
    }
  }
  navigateToNextJS(redirect: string) {
    const jwtToken = localStorage.getItem('access_token'); // Get your JWT token from somewhere
    console.log(serviceBaseUrl);
    const url = `${serviceBaseUrl}/?token=${jwtToken}`;

    if (redirect !== '') {
      window.location.href = `${serviceBaseUrl}/token-verify?redirect=${redirect}&token=${jwtToken}`;
    } else {
      window.location.href = url.toString();
    }
  }
  // Additional method to handle profile service errors
  private handleProfileError(error: any): void {
    this.errorMessage = '';
    if (
      error.error.error.message ===
      'There is no entity DoctorProfile with id = !'
    ) {
      this.errorMessage = 'User not found';
    } else {
      this.ToasterService.customToast(
        String(error.error.error.message),
        'error'
      );
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
