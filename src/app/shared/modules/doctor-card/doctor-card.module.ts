import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { BookingReviewModule } from '../booking-review/booking-review.module';
import { InputModule } from '../input/input.module';
import { MaterialModulesModule } from '../material-modules/material-modules.module';
import { DoctorCardComponent } from './doctor-card.component';
import { DynamicBookingModule } from '../dynamic-booking/dynamic-booking.module';
import { AvailableDayTimeComponent } from '../../components/available-day-time/available-day-time.component';

@NgModule({
  declarations: [DoctorCardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([]),
    InputModule,
    MaterialModulesModule,
    MatButtonModule,
    BookingReviewModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    NgOptimizedImage,
    DynamicBookingModule,
    AvailableDayTimeComponent,
  ],
  exports: [DoctorCardComponent],
})
export class DoctorCardModule {}
