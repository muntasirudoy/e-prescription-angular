import { Component, Inject, Input } from '@angular/core';
import { BookingService } from '../../service/booking.service';
import { FormGroup } from '@angular/forms';
import { CONTROL_DATA } from '../../service/control.data.token';

@Component({
  selector: 'app-booking-type',
  templateUrl: './booking-type.component.html',
  styleUrl: './booking-type.component.scss',
})
export class BookingTypeComponent {
  bookingType!: FormGroup;
  @Input() doctorDetails: any; // Ensure doctorDetails is declared with @Input()
  @Input() doctorScheduleInfo: any; // Ensure doctorScheduleInfo is declared with @Input()
  @Input() userAccess!: boolean; // Ensure userAccess is declared with @Input()
  @Input() isAuthUser!: boolean;
  constructor(
    public BookingService: BookingService,
    @Inject(CONTROL_DATA) public controlData: any
  ) {
    console.log(controlData);
  }
  onSelectItem(item: string) {
    this.BookingService.selectedItem.update((v) => ({ ...v, [item]: true }));
  }
  onPlanChange() {}
}
