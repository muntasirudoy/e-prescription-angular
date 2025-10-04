import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-agent-booking-dialog',
  templateUrl: './agent-booking-dialog.component.html',
  styleUrls: ['./agent-booking-dialog.component.scss']
})
export class AgentBookingDialogComponent {
  form!:FormGroup
  editData!:any
}
