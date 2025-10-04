import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AgentSignupComponent } from './agent-signup.component';

import { Route, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PhoneNumberValidatorDirective } from 'src/app/shared/utils/number-validators';

const routes: Route[] = [
  {
    path: '',
    component: AgentSignupComponent,
  },
];

@NgModule({
  declarations: [AgentSignupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgOptimizedImage,
    PhoneNumberValidatorDirective,
  ],
})
export class AgentSignupModule {}
