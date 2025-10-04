import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-booking-type-card',

  templateUrl: './booking-type-card.component.html',
  styleUrl: './booking-type-card.component.scss',
})
export class BookingTypeCardComponent {
  @Input() typeName: string = '';
}
