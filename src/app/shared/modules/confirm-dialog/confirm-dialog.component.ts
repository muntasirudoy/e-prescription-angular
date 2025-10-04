import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public editData: any | undefined,
  public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {}


  confirmDelete(){
    this.dialogRef.close(true);
  }
}
