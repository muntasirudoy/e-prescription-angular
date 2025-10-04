import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { CardTitleComponent } from './components/card-title/card-title.component';
import { DynamicBookingComponent } from './dynamic-booking.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { AuthCheckingComponent } from './components/auth-checking/auth-checking.component';
import { BookForComponent } from './components/book-for/book-for.component';
import { BookingForCardComponent } from './components/book-for/booking-for-card/booking-for-card.component';
import { BookingTypeCardComponent } from './components/booking-type/booking-type-card/booking-type-card.component';
import { BookingTypeComponent } from './components/booking-type/booking-type.component';
import { CreateSomeoneComponent } from './components/create-someone/create-someone.component';
import { ReviewComponent } from './components/review/review.component';
import { ScheduleHeadingComponent } from './components/schedule/schedule-heading/schedule-heading.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { SlotsComponent } from './components/schedule/slots/slots.component';
import { ControlInjector } from './service/pipe/control-injector.pipe';
import { CouponCardComponent } from '../../components/coupon-card/coupon-card.component';
import { MatSelectModule } from '@angular/material/select';
import { LoginInputComponent } from 'src/app/core-modules/auth/login/components/login-input/login-input.component';
//import { LoginFormModule } from 'src/app/core-modules/login/login-form/login-form.module';
@NgModule({
  declarations: [
    DynamicBookingComponent,
    BookingTypeCardComponent,
    BookingTypeComponent,
    CardTitleComponent,
    BookingForCardComponent,
    BookForComponent,
    ScheduleComponent,
    ScheduleHeadingComponent,
    SlotsComponent,
    ReviewComponent,

    CreateSomeoneComponent,
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    NgOptimizedImage,
    MatButtonToggleModule,
    MatCardModule,
    RouterModule.forChild([]),
    ReactiveFormsModule,
    ControlInjector,
    MatDatepickerModule,
    MatInputModule,
    MatDialogModule,
    CouponCardComponent,
    MatSelectModule,

    AuthCheckingComponent,
    //LoginFormModule,
  ],
  exports: [DynamicBookingComponent],
})
export class DynamicBookingModule {}
