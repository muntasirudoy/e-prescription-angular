import { Component, Input, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss'],
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
