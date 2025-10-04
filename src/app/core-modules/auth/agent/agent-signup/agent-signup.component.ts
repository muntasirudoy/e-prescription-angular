import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgentMasterDto, AgentSupervisorDto } from 'src/app/proxy/dto-models';
import { UserManageAccountsService } from '../../auth-service/user-manage-accounts.service';
import { UserSingupRequestDto } from 'src/app/proxy/soow-good/domain/service/models/user-info';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TosterService } from 'src/app/shared/services/toster.service';
import { passwordMatchValidator } from 'src/app/shared/utils/auth-helper';
import { SubSink } from 'subsink';
import {
  AgentMasterService,
  AgentSupervisorService,
} from '../../../../proxy/services';
import { AuthService as Auth } from '../../auth-service/auth.service';
import { AgentProfileInputDto } from './../../../../proxy/input-dto/models';
import { AgentProfileService } from './../../../../proxy/services/agent-profile.service';
@Component({
  selector: 'app-agent-signup',
  templateUrl: './agent-signup.component.html',
  styleUrls: ['./agent-signup.component.scss'],
})
export class AgentSignupComponent implements OnInit {
  signupForm!: FormGroup;
  isLoading!: boolean;
  agentProfileDto!: AgentProfileInputDto;
  agenetMasterList!: AgentMasterDto[];
  agentSupervisorList!: AgentSupervisorDto[];
  agentId: any;
  subs = new SubSink();
  confirmPasswordFieldType: string = 'password';
  passwordFieldType: string = 'password';
  formSubmitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private AgentProfileService: AgentProfileService,
    private AgentMasterService: AgentMasterService,
    private AgentSupervisorService: AgentSupervisorService,
    private NormalAuth: AuthService,
    private UserManageAccountsService: UserManageAccountsService,
    private TosterService: TosterService,
    private _router: Router,
    private Auth: Auth
  ) {}

  ngOnInit() {
    this.loadForm();
    this.AgentMasterService.getAllAgentMasterList().subscribe(
      (res) => (this.agenetMasterList = res)
    );
  }

  loadForm() {
    this.signupForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        //agentCode: ['123456', Validators.required],
        organizationName: ['0', Validators.required],
        agentSuperVisor: ['0', Validators.required],
        address: ['', Validators.required],
        city: ['Dhaka', Validators.required],
        zipCode: ['1212', Validators.required],
        country: ['Bangladesh', Validators.required],
        mobileNo: [
          '',
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
          ],
        ],
        email: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{6,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
        isActive: ['true'],
      },
      { validator: passwordMatchValidator }
    );
  }
  onSubmit() {
    this.isLoading = true;
    this.formSubmitted = true;
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }

    // const agentInfo = {
    //   tenantId: null,
    //   userName: this.signupForm.value.mobileNo,
    //   name: this.signupForm?.value.fullName,
    //   surname: '',
    //   email: this.signupForm.value.email,
    //   emailConfirmed: true,
    //   phoneNumber: this.signupForm.value.mobileNo,
    //   phoneNumberConfirmed: true,
    //   address: this.signupForm.value.address,
    //   city: this.signupForm.value.city,
    //   zipCode: this.signupForm.value.zipCode,
    //   country: this.signupForm.value.country,
    //   isActive: true,
    //   lockoutEnabled: false,
    //   lockoutEnd: '2023-07-16T07:38:44.382Z',
    //   concurrencyStamp: '',
    //   // agentMasterId: this.signupForm.value.organizationName,
    //   // agentSupervisorId: this.signupForm.value.agentSuperVisor,
    //   role: 'Agent',
    //   password: this.signupForm.value?.password,
    // };

    const userSignupRequest: UserSingupRequestDto = {
      userName: this.signupForm.value.mobileNo,
      name: this.signupForm?.value.fullName,
      surname: 'default',
      email: 'sg@agent.com',
      password: this.signupForm?.value.password,
      phoneNumber: this.signupForm.value.mobileNo,
      roleId: 'Agent',
    };

    this.UserManageAccountsService.signupUserByRequest(
      userSignupRequest
    ).subscribe((res) => {
      console.log(res);

      if (res) {
        this.AgentProfileService.create({
          ...this.signupForm.value,

          agentMasterId: this.signupForm.value?.organizationName,
          agentSupervisorId: this.signupForm.value?.agentSuperVisor,
          userId: res.results.userId,
        }).subscribe((profRes: any) => {
          console.log(profRes);
          this.subs.sink = this.AgentProfileService.getByUserId(
            profRes.userId
          ).subscribe((agentDto: AgentProfileInputDto) => {
            this.agentProfileDto = agentDto;
            this.agentId = agentDto.id;
            //let saveLocalStorage = {
            //  agentName: agentDto.fullName,
            //  isActive: agentDto.isActive,
            //  userId: res.userId,
            //  id: agentDto.id,
            //  userType :"agent"
            //};
            //this.NormalAuth.setAuthInfoInLocalStorage(saveLocalStorage);
            this.formSubmitted = false;
            this.NormalAuth.signOut();
            //if (this.normalAuth) {
            //  this.loadAuth();
            //}
            //let navUrl = this.userType.toLowerCase() + '/dashboard';
            this._router
              .navigate(['/agent/login'], {
                state: { data: res }, // Pass the 'res' object as 'data' in the state object
              })
              .then((r) =>
                this.TosterService.customToast(String(res.message), 'success')
              );

            //this.TosterService.customToast(String(res.message), 'success');
            //this._router.navigate(["/agent"])
          });
        });
      } else {
        this.isLoading = false;
        this.formSubmitted = false;
        this.TosterService.customToast(String(res), 'error');
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
  loadAgentSupervisors(event: any) {
    this.AgentSupervisorService.getAgentSupervisorsByAgentMasterList(
      event.target.value
    ).subscribe((res) => {
      this.agentSupervisorList = res;
    });
  }
}
