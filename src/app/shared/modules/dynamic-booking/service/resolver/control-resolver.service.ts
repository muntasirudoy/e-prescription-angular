import { Injectable } from '@angular/core';
import { BookingTypeComponent } from '../../components/booking-type/booking-type.component';
import { BookForComponent } from '../../components/book-for/book-for.component';
import { CreateSomeoneComponent } from '../../components/create-someone/create-someone.component';
import { AuthCheckingComponent } from '../../components/auth-checking/auth-checking.component';
import { ReviewComponent } from '../../components/review/review.component';
import { ScheduleComponent } from '../../components/schedule/schedule.component';
//import { LoginFormComponent } from 'src/app/core-modules/login/login-form/login-form.component';


@Injectable({
  providedIn: 'root',
})
export class ControlResolverService {
  private controlComponents: any = {
    unauthorized: AuthCheckingComponent,//LoginFormComponent,
    bookingType: BookingTypeComponent,
    bookFor: BookForComponent,
    schedule: ScheduleComponent,
    createSomeone: CreateSomeoneComponent,
    review: ReviewComponent,
  };
  resolve(event: string) {
    return this.controlComponents[event];
  }
}
