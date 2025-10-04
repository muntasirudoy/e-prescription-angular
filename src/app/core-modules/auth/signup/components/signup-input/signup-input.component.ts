import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, effect, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup-input',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    RouterModule,
  ],
  templateUrl: './signup-input.component.html',
  styleUrl: './signup-input.component.scss',
})
export class SignupInputComponent {
  signupForm!: FormGroup;
  formSubmitted = false;
  errorMessage = '';
  isLoading = false;
  @Output() onRequestForOtp = new EventEmitter();
  constructor() {}
  sendOtp() {
    this.onRequestForOtp.emit();
  }
}
