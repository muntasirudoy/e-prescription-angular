import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BreadcrumbComponent],
  imports: [CommonModule, RouterModule.forChild([])],
  exports: [BreadcrumbComponent],
})
export class BreadcrumbModule {}
