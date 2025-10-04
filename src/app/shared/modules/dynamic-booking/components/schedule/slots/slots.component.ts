import { BookingService } from './../../../service/booking.service';
import { Component, Input, effect } from '@angular/core';
import { filter } from 'rxjs';
import { DoctorScheduleStateService } from '../../../../../services/states/doctors-states/doctor-schedule-state.service';

@Component({
  selector: 'app-slots',
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.scss'],
})
export class SlotsComponent {
  slotList: any[] = [];
  @Input() item: any;
  constructor(private BookingService: BookingService) {
    effect(() => {
      this.slotList = this.BookingService.availAbleSlot();
    });
  }

  selectSlot(data: {}) {
    this.BookingService.selectedSlot.set(data);
  }
}
