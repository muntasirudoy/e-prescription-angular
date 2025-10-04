import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prescription-patient',

  templateUrl: './prescription-patient.component.html',
  styleUrl: './prescription-patient.component.scss',
})
export class PrescriptionPatientComponent {
  @Input() patientInfo: any;
  @Input() appointmentInfo: any;
}
