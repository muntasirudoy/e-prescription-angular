import { UserManageAccountsService } from './../../../proxy/services/user-manage-accounts.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, signal, OnInit } from '@angular/core';
import { OtpComponent } from '../components/otp/otp.component';
import { SignupInputComponent } from './components/signup-input/signup-input.component';
import { SignupOtpComponent } from './components/signup-otp/signup-otp.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SendOtpModel } from 'src/app/proxy/soow-good/domain/service/models/user-info';
type SignupState = {
  signupInput: boolean;
  SignupOtp: boolean;
};
type Otp = {
  pin: number;
  isLoading: boolean;
  otpError: string | undefined;
  otpSuccess: string | undefined;
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    SignupInputComponent,
    OtpComponent,
    NgOptimizedImage,
    SignupOtpComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  schemas: [NO_ERRORS_SCHEMA],
})
export class SignupComponent implements OnInit {
  signupState = signal<SignupState>({
    signupInput: true,
    SignupOtp: false,
  });
  otp = signal<Otp>({
    pin: 0,
    isLoading: false,
    otpError: '',
    otpSuccess: '',
  });
  signupForm!: FormGroup;
  constructor(
    private UserManageAccountsService: UserManageAccountsService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      userTypeName: ['', Validators.required],
      mobile: ['', Validators.required],
    });
  }

  onRequestForOtp() {
    const mobileNo = "form.get('mobile')?.value";
    const userType = "form.get('userTypeName')?.value";

    // TODO : remove static usertype
    let otpData: SendOtpModel = {
      userName: mobileNo,
      roleId: 'Patient',
      type: 1,
    };
    if (userType) {
      return this.onSubmit();
    } else {
      try {
        this.UserManageAccountsService.sendOtpByRequest(otpData).subscribe({
          next: (res) => {
            if (res.is_success) {
              this.otp.update((p) => ({
                ...p,
                isLoading: false,
                otpSuccess: res.message,
              }));
              this.signupState.set({
                signupInput: false,
                SignupOtp: true,
              });
            } else {
              this.otp.update((p) => ({
                ...p,
                isLoading: false,
                otpError: res.message,
              }));
            }
          },
          error: () => {
            this.otp.update((p) => ({
              ...p,
              isLoading: false,
              otpError: 'User not exist!',
            }));
          },
        });
      } catch (error) {
        console.log(error);
        this.otp.update((p) => ({
          ...p,
          isLoading: false,
          otpError: 'something went wrong',
        }));
      }
    }
  }
  onSubmit() {}
  onOtpChange(value: string) {
    console.log(value);
  }
}
