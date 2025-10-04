import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { CompleteProfileComponent } from './complete-profile.component';

import { MaterialModule } from './utils/material.module';
const routes: Route[] = [
  {
    path: '',
    component: CompleteProfileComponent,
  },
];

@NgModule({
  declarations: [
    CompleteProfileComponent,

  ],
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule,MaterialModule],
})
export class CompleteProfileModule {}
