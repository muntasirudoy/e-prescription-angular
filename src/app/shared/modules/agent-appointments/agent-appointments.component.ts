import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-agent-appointments',
  templateUrl: './agent-appointments.component.html',
  styleUrls: ['./agent-appointments.component.scss']
})
export class AgentAppointmentsComponent {


  @Input() layout = 'dashboard'
  @Output() onClickBooking: EventEmitter<any> = new EventEmitter<boolean>();
}
