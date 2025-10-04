import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { USER_SECRATE } from 'src/environments/environment';
@Component({
  selector: 'app-auth-checking',

  templateUrl: './auth-checking.component.html',
  styleUrl: './auth-checking.component.scss',
})
export class AuthCheckingComponent implements OnInit {
  token: string | null = '';
  eUserInfo: string = '';
  key: string = USER_SECRATE;

  constructor(
    private AuthService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private ActivatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    let info = this.AuthService.authInfo();
    let isAuth = this.AuthService.authInfo()?.userType;
    let redirect = this.ActivatedRoute.snapshot.queryParams['redirect'];
    if (!isAuth) {
      this.router.navigate(['/service-login'], {
        queryParams: { redirect: redirect },
      });
    } else {
      this.eUserInfo = encodeURIComponent(
        String(localStorage.getItem('access_token'))
      );
    }
  }

  continueToService() {
    let redirect = this.ActivatedRoute.snapshot.queryParams['redirect'];
    if (redirect) {
      // window.open(
      //   `http://localhost:3000/${redirect}?token=${this.eUserInfo}`,
      //   '_blank'
      // );
      window.open(
        `http://localhost:3000/token-verify?redirect=${redirect}&token=${this.eUserInfo}`,
        '_blank'
      );
    } else {
      window.open(`http://localhost:3000?token=${this.eUserInfo}`, '_blank');
    }
  }
  private encrypt(user: string): string {
    return CryptoJS.AES.encrypt(user, this.key).toString();
  }
}
