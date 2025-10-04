import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentBookingDialogComponent } from './agent-booking-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AgentBookingDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    AgentBookingDialogComponent
  ]
})
export class AgentBookingDialogModule { }
