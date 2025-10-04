import { MatDialog } from '@angular/material/dialog';
import { TosterService } from './../../../shared/services/toster.service';

import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';
import { SearchFilterComponent } from './search-filter/search-filter.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() layout: string = '';

  isAuthLogin!: boolean;
  userType: string = '';
  scrolled: boolean = false;
  logoPath: string = 'assets/SoowGood-Logo.png';
  authInfo: any;
  isVisible!: boolean;
  authenticatedUserDetails: any;

  constructor(
    private NormalAuth: AuthService,
    private MainAuth: AuthService,
    private UserinfoStateService: UserinfoStateService,
    private router: Router,
    private TosterService: TosterService,
    private ElementRef: ElementRef
  ) {}
  ngOnInit(): void {
    // this.onClickSearch();
    //let id = this.NormalAuth.authInfo().id;
    const authInfo = this.NormalAuth.authInfo();
    this.authInfo = authInfo;
    let id = authInfo ? authInfo.id : null;
    this.UserinfoStateService.getProfileInfo(id, this.authInfo?.userType);
    if (id) {
      this.isAuthLogin = true;
    } else {
      this.isAuthLogin = false;
    }
    this.UserinfoStateService.authenticateUserInfo.subscribe((res) => {
      this.authenticatedUserDetails = res;
      console.log(res);
    });
    this.userType = authInfo ? authInfo.userType : '';
  }
  signOut(): void {
    // this.NormalAuth.signOut();
    this.MainAuth.signOut();
    this.isAuthLogin = false;
    window.location.reload();
  }
  navigator(path: string) {
    let base = `/${path}`;
    this.router.navigateByUrl(base);
  }
  checkAuthUser(type: string) {
    if (type === 'doctor' || 'patient') {
      if (type === 'doctor') {
        this.TosterService.customToast(
          'Your are already login as Doctor',
          'warning'
        );
      }
      if (type === 'patient') {
        this.TosterService.customToast(
          'Your are already login as Patient',
          'warning'
        );
      } else {
        return;
        // this.TosterService.customToast('Something went wrong', 'error');
      }
    }
  }
  openHomeMenu() {
    // this.menuService.homeMenuVisible(true);
    this.isVisible = !this.isVisible;
  }
  // onClickService() {
  //   let isRoute = this.ActivatedRoute.snapshot;
  //   let instantCall = document.getElementById('service');

  //   console.log('hekll', instantCall);
  //   if (isRoute.routeConfig?.path == '/') {
  //     if (instantCall) {
  //       instantCall.scrollIntoView({ behavior: 'smooth' });
  //     }
  //   } else {
  //     this.router.navigate(['/']).then(() => {
  //       if (instantCall) {
  //         instantCall.scrollIntoView({ behavior: 'smooth' });
  //       }
  //     });
  //   }
  // }
  gotoSearchPage(value: string) {
    if (value) {
      this.router.navigate(['/search'], {
        queryParams: { consultancyType: value },
      });
    } else {
      this.router.navigate(['/search']);
    }
  }
  @HostListener('document:click', ['$event.target'])
  onClick(target: any) {
    const clickedInside = this.ElementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.isVisible = false;
    }
  }

  onClickService() {
    let services = document.getElementById('services');
    if (services) {
      services.scrollIntoView({ behavior: 'smooth' });
    }
  }
  onClickSearch() {
    // this.dialog.open(SearchFilterComponent);
  }
}
