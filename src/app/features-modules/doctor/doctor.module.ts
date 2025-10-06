import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Route, RouterModule } from '@angular/router';
import { isAuth } from 'src/app/auth-gurd/auth.service';
import { DashboardMenuComponent } from 'src/app/shared/modules/dashboard-menu/dashboard-menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DoctorComponent } from './doctor.component';
import { DoctorsPrescriptionsComponent } from './doctors-prescriptions/doctors-prescriptions.component';
import { MyPatientsComponent } from './my-patients/my-patients.component';
import { PrescribeComponent } from './prescribe/prescribe.component';

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
      {
        path: 'patients',
        component: MyPatientsComponent,
      },
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
    MyPatientsComponent,
  ],
  // providers: [
  //   { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  // ],
})
export class DoctorModule {}
