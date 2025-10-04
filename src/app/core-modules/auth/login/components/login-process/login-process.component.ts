import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoginInputComponent } from '../login-input/login-input.component';
@Component({
  selector: 'app-login-process',
  standalone: true,
  imports: [CommonModule, LoginInputComponent],
  templateUrl: './login-process.component.html',
  styleUrl: './login-process.component.scss',
})
export class LoginProcessComponent implements OnInit {
  selectedUser = new Subject();
  selectedUserType = '';

  constructor(
    private _router: Router,
    private ActivatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.ActivatedRoute.queryParams.subscribe((params) => {
      this.selectedUserType = params['userType'];
    });
  }

  selectUser(value: string) {
    this.updateQueryParam(value);
    this.selectedUser.next(value);
  }

  updateQueryParam(userType: string) {
    this._router.navigate([], {
      relativeTo: this.ActivatedRoute,
      queryParams: { userType: userType },
      queryParamsHandling: 'merge',
    });
  }
}
