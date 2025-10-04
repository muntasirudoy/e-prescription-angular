import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicDoctorsComponent } from './public-doctors.component';
import { DoctorCardModule } from '../doctor-card/doctor-card.module';
import { SkeletonModule } from '../skeleton/skeleton.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
// import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import { FilterModule } from '../filter/filter.module';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  declarations: [
    PublicDoctorsComponent,
    ],
  imports: [
    CommonModule,
    DoctorCardModule,
    SkeletonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatInputModule,
    FilterModule,
    MatSidenavModule 
  ],
exports:[
  PublicDoctorsComponent
],

// providers: [
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: SplashInterceptor,
//       multi: true,
//     },
//   ],
})
export class PublicDoctorsModule { }
