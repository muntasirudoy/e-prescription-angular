import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthCheckingComponent } from './auth-checking.component';
import { Route, RouterModule } from '@angular/router';
const routes: Route[] = [
  {
    path: '',
    component: AuthCheckingComponent,
  },
];
@NgModule({
  declarations: [AuthCheckingComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [AuthCheckingComponent],
})
export class AuthCheckingModule {}
