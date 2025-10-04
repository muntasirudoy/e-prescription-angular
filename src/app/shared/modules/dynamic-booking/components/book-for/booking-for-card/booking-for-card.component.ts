import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-booking-for-card',

  templateUrl: './booking-for-card.component.html',
  styleUrl: './booking-for-card.component.scss',
})
export class BookingForCardComponent {
  @Input() forName: string = '';
}
