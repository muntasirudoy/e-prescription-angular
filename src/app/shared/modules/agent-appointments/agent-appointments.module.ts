import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentAppointmentsComponent } from './agent-appointments.component';



@NgModule({
  declarations: [
    AgentAppointmentsComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    AgentAppointmentsComponent
  ]
})
export class AgentAppointmentsModule { }
