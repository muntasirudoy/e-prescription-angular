import { NgModule } from '@angular/core';
import {
  ExtraOptions,
  PreloadAllModules,
  Route,
  RouterModule,
} from '@angular/router';
import { routerGuard } from './auth-gurd/router.guard';
import { LoginComponent } from './core-modules/auth/login/login.component';

import { PoliceSoowgoodComponent } from './police.soowgood/police.soowgood.component';
import { DoctorLayoutComponent } from './layout-module/layouts/doctor-layout/doctor-layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: DoctorLayoutComponent,
    // loadChildren: () =>
    //   import('./features-modules/public/landing-page/landing-page.module').then(
    //     (m) => m.LandingPageModule
    //   ),
  },

  {
    path: 'login',
    canActivate: [routerGuard],
    component: LoginComponent,
  },

  {
    path: 'police',
    component: PoliceSoowgoodComponent,
  },

  {
    path: 'auth-checking',
    loadChildren: () =>
      import('./core-modules/auth/auth-checking/auth-checking.module').then(
        (m) => m.AuthCheckingModule
      ),
  },
  {
    path: 'service-login',
    loadChildren: () =>
      import('./core-modules/auth/service-login/service-login.module').then(
        (m) => m.ServiceLoginModule
      ),
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
    path: 'agent/signup',
    canActivate: [routerGuard],
    loadChildren: () =>
      import('./core-modules/auth/agent/agent-signup/agent-signup.module').then(
        (m) => m.AgentSignupModule
      ),
  },
  {
    path: 'agent/login',
    canActivate: [routerGuard],
    loadChildren: () =>
      import('./core-modules/auth/agent/agent-login/agent-login.module').then(
        (m) => m.AgentLoginModule
      ),
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
  ],
  exports: [RouterModule],
})
export class AppRouting {}
