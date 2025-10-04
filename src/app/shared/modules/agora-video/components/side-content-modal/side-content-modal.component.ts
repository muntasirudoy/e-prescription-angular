import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { prescriptionApi } from 'src/environments/environment';

@Component({
  selector: 'app-side-content-modal',

  templateUrl: './side-content-modal.component.html',
  styleUrl: './side-content-modal.component.scss',
})
export class SideContentModalComponent {
  constructor(
    public dialogRef: MatDialogRef<SideContentModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public docData: any
  ) {}
  showPdf(path: string) {
    const printWindow = window.open(`${prescriptionApi}/${path}`, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  }
}
