import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserAccountsService } from 'src/app/proxy/services';
import { TosterService } from 'src/app/shared/services/toster.service';
import { SubSink } from 'subsink';
import { AppAuthService } from '../../../../auth-services/app-auth.service';
import { AgentProfileService } from './../../../../proxy/services/agent-profile.service';
import { AuthService } from '../../auth-service/auth.service';
import { AuthService as NormalAuth } from '../../../../shared/services/auth.service';
@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.scss'],
})
export class AgentLoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading!: boolean;
  formSubmitted = false;
  hasError!: boolean;
  errorMessage!: string;
  defaultAuth: any = {
    mobileNo: '',
    password: '',
  };
  subs = new SubSink();
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  constructor(
    private ToasterService: TosterService,
    private UserAuthService: UserAccountsService,
    private appAuthService: AppAuthService,
    private oAuthService: OAuthService,
    private AgentProfileService: AgentProfileService,
    private NormalAuth: NormalAuth,
    private _router: Router,
    private fb: FormBuilder,
    private Auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadForm();
  }
  goToForgotPassword() {
    this._router.navigate(['/forgot-password'], {
      queryParams: { redirect: 'agent/login' },
    });
  }
  loadForm() {
    this.loginForm = this.fb.group({
      mobileNo: [this.defaultAuth.mobileNo, Validators.required],
      password: [
        this.defaultAuth.password,
        Validators.compose([Validators.required]),
      ],
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    // if (this.loginForm.invalid) {
    //   this.ToasterService.customToast(
    //     'Please filled all required field',
    //     'warning'
    //   );
    //   return;
    // }
    this.isLoading = true;

    this.oAuthService.oidc = false;
    let agentInfo = {
      userName: this.loginForm.value.mobileNo,
      password: this.loginForm.value.password,
      otp: null,
      userLoginType: 3,
    };
    try {
      this.appAuthService.isLoadingSubject.next(true);
      this.Auth.loginApiByRequest(agentInfo).subscribe({
        next: (userInfo) => {
          if (
            userInfo.is_success &&
            userInfo.results.roleName[0].toLowerCase() !== 'agent'
          ) {
            this.errorMessage = 'You are not authenticated agent';
            this.isLoading = false;
            return;
          }

          this.formSubmitted = false;
          if (
            userInfo.is_success &&
            userInfo.results.roleName[0].toLowerCase() === 'agent'
          ) {
            this.AgentProfileService.getByUserName(
              userInfo.results.userName || ''
            ).subscribe((agentDto: any) => {
              const saveLocalStorage = {
                fullName: agentDto.fullName,
                agentMasterId: agentDto.agentMasterId,
                userId: agentDto.userId,
                id: agentDto.id,
                userType: userInfo.results.roleName[0].toString().toLowerCase(),
              };
              this.NormalAuth.setAuthInfoInLocalStorage(saveLocalStorage);
              const userType = agentDto.isActive
                ? userInfo.results.roleName[0].toString().toLowerCase()
                : (
                    userInfo.results.roleName[0].toString() + '/dashboard'
                  ).toLowerCase();
              this._router.navigate([userType], {
                state: { data: agentDto },
              });
            });
          } else {
            this.isLoading = false;
            this.errorMessage = userInfo.message || '';
          }

          // if (
          //   userInfo.results.roleName[0].toLowerCase() === 'doctor' ||
          //   userInfo.results.roleName[0].toLowerCase() === 'patient'
          // ) {
          //   this.errorMessage = `You ara a ${userInfo.results.roleName[0].toLowerCase()}. Please login from ${userInfo.results.roleName[0].toLowerCase()} portal.`;
          // }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message;
        },
      });
    } catch (error: any) {
      this.errorMessage = error.message;
      this.isLoading = false;
      this.hasError = true;
      if (error.message === "'tokenEndpoint' should not be null") {
        this.ToasterService.customToast(error.message || ' ', 'success');
      }
    }
  }
  handleLoginError(error: any): any {
    this.isLoading = false;
  }
  handleProfileError(error: any): any {
    this.isLoading = false;
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
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
