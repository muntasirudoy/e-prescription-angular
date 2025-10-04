import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogComponent } from './dynamic-dialog.component';
import { ResetPasswordModule } from '../reset-password/reset-password.module';
import { DeleteAccountModule } from '../delete-account/delete-account.module';

@NgModule({
  declarations: [DynamicDialogComponent],
  imports: [CommonModule, ResetPasswordModule, DeleteAccountModule],
})
export class DynamicDialogModule {}
