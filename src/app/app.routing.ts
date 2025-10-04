import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { routerGuard } from './auth-gurd/router.guard';
import { LoginComponent } from './core-modules/auth/login/login.component';
import { DoctorLayoutComponent } from './layout-module/doctor-layout.component';
import { isAuth } from './auth-gurd/auth.service';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('../app/features-modules/doctor/doctor.module').then(
        (m) => m.DoctorModule
      ),
  },
  {
    path: 'login',
    canActivate: [routerGuard],
    component: LoginComponent,
  },

  {
    path: 'signup',
    //canActivate:[routerGuard],
    loadChildren: () =>
      import('./core-modules/auth/signup-o/signup.module').then(
        (m) => m.SignupModule
      ),
    // component: SignupComponent,
  },
  {
    path: 'doctor',
    canActivate: [isAuth],
    data: { breadcrumb: 'Doctor' },
    component: DoctorLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../app/features-modules/doctor/doctor.module').then(
            (m) => m.DoctorModule
          ),
      },
    ],
  },
  // {
  //   path: '**',
  //   component: ,
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      useHash: false,
      // preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64],
    }),
    DoctorLayoutComponent,
  ],
  exports: [RouterModule],
})
export class AppRouting {}
