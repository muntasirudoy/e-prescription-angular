import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SideContentModalComponent } from '../side-content-modal/side-content-modal.component';
import { PrescriptionPdf } from 'src/app/shared/services/prescription/prescription.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent {
  @Input() appointmentInfo!: any;
  @Input() patientInfo!: any;
  @Input() patientPrescriptions!: PrescriptionPdf[];
  constructor(public dialog: MatDialog) {}
  onClickNav(menu: string) {
    const dialogRef = this.dialog.open(SideContentModalComponent, {
      maxWidth: '100vw',
      width: '100vw',
      data: {
        component: menu,
        appointmentInfo: this.appointmentInfo,
        patientInfo: this.patientInfo,
        patientPrescriptions: this.patientPrescriptions,
      },
      height: '100vh',
    });
  }
}
