import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DynamicBookingComponent } from '../../dynamic-booking.component';
import { LoginInputComponent } from 'src/app/core-modules/auth/login/components/login-input/login-input.component';

@Component({
  selector: 'app-auth-checking',
  templateUrl: './auth-checking.component.html',
  styleUrl: './auth-checking.component.scss',
  standalone: true,
  imports: [LoginInputComponent],
})
export class AuthCheckingComponent {
  navigateURL = '';
  constructor(
    public dialogRef: MatDialogRef<AuthCheckingComponent>,
    private Router: Router
  ) {
    this.navigateURL = this.Router.url;
  }
}
