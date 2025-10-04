import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserManageAccountsService } from '../../../auth-service/user-manage-accounts.service';

@Component({
  selector: 'app-organization-id',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organization-id.component.html',
  styleUrl: './organization-id.component.scss',
})
export class OrganizationIdComponent {
  private dialog = inject(MatDialogRef<OrganizationIdComponent>);
  private UserManageAccountsService = inject(UserManageAccountsService);
  public userId: string = inject(MAT_DIALOG_DATA);

  organizationNumber!: number;
  dialogResult = {
    close: false,
    save: false,
    organizationNumber: null,
  };
  message: { isLoading: boolean; message: string | undefined } = {
    isLoading: false,
    message: '',
  };
  close() {
    this.dialog.close({
      ...this.dialogResult,
      close: true,
    });
  }
  save() {
    if (this.organizationNumber) {
      this.UserManageAccountsService.validateOrganizationById({
        organizationId: this.organizationNumber,
        userId: this.userId,
      }).subscribe((res) => {
        if (!res.is_success) {
          this.message = {
            isLoading: false,
            message: res.message,
          };
        } else {
          this.message = {
            isLoading: false,
            message: '',
          };
          this.dialog.close({
            ...this.dialogResult,
            save: true,
          });
        }
      });
    } else {
      console.log('Enter id');
    }
  }
}
