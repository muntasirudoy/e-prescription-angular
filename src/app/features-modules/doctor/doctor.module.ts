import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Route, RouterModule } from '@angular/router';
import { DoctorComponent } from './doctor.component';
import { DoctorsPrescriptionsComponent } from './doctors-prescriptions/doctors-prescriptions.component';
import { PrescribeComponent } from './prescribe/prescribe.component';
import { isAuth } from 'src/app/auth-gurd/auth.service';
import { DashboardMenuComponent } from 'src/app/shared/modules/dashboard-menu/dashboard-menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Route[] = [
  {
    path: '',
    component: DoctorComponent,
    // canActivate: [isAuth],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        // canActivate: [isAuth],
        component: DashboardComponent,
      },

      // {
      //   path: 'patients',
      //   loadChildren: () =>
      //     import('./my-patients/my-patients.component').then(
      //       (m) => m.MyPatientsComponent
      //     ),
      // },
      // {
      //   path: 'hospital-schedule',
      //   loadChildren: () =>
      //     import('./hospital-schedule/hospital-schedule.module').then(
      //       (m) => m.HospitalScheduleModule
      //     ),
      // },
      // {
      //   path: 'billing',
      //   loadChildren: () =>
      //     import('./billing/billing.module').then((m) => m.BillingModule),
      // },
      // {
      //   path: 'profile-settings',
      //   loadChildren: () =>
      //     import('./profile-settings/profile-settings.module').then(
      //       (m) => m.ProfileSettingsModule
      //     ),
      // },
      // {
      //   path: 'video-consultation',
      //   loadChildren: () =>
      //     import('./video-consultation/video-consultation.module').then(
      //       (m) => m.VideoConsultationModule
      //     ),
      // },
      {
        path: 'build-prescription',
        component: PrescribeComponent,
      },
      {
        path: 'prescriptions',
        component: DoctorsPrescriptionsComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [DoctorComponent],
  imports: [
    CommonModule,
    DashboardMenuComponent,
    MatSidenavModule,
    RouterModule.forChild(routes),
    DoctorsPrescriptionsComponent,
  ],
  // providers: [
  //   { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  // ],
})
export class DoctorModule {}
