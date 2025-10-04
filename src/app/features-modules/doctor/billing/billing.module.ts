import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from './billing.component';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    component: BillingComponent,
  },
  
]

@NgModule({
  declarations: [
    BillingComponent
  ],
  imports: [
    CommonModule,RouterModule.forChild(routes)
  ]})
export class BillingModule { }
