import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-schedule-heading',

  templateUrl: './schedule-heading.component.html',
  styleUrl: './schedule-heading.component.scss',
})
export class ScheduleHeadingComponent {
  @Input() doctorData!: any;
  @Input() totalFee!: number;
}
