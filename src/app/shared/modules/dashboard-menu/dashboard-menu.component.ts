import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItemComponent } from './menu-item/menu-item.component';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuItemComponent],
})
export class DashboardMenuComponent implements OnInit {
  @Input() menuList: any = [];
  collapsed = false;
  private autoCollapsed = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateCollapseState(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    const width = (event.target as Window).innerWidth;
    this.updateCollapseState(width);
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
    this.autoCollapsed = false;
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  private updateCollapseState(width: number): void {
    if (width < 1280) {
      this.collapsed = true;
      this.autoCollapsed = true;
    } else if (this.autoCollapsed) {
      this.collapsed = false;
      this.autoCollapsed = false;
    }
  }
}
