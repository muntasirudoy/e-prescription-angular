import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { TopHeaderComponent } from './top-header/top-header.component';

@NgModule({
  declarations: [HeaderComponent, TopHeaderComponent],
  imports: [CommonModule, RouterModule.forChild([]), MatMenuModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
