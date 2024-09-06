import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AdminSideNav } from "../../data/interface/admin-side-nav.interface";
import { AppNode } from "@shared-routes";
import { SecurityService, UserNavigationComponent } from "@feature-security";
import { ThemeTogglerComponent } from "@shared-ui";
import { TranslateModule } from "@ngx-translate/core";
import {NgClass, NgForOf} from "@angular/common";
import { UserAvatarComponent } from "../../../shared/ui/user-avatar/user-avatar.component";

@Component({
  selector: 'app-admin-router',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ThemeTogglerComponent,
    TranslateModule,
    UserNavigationComponent,
    NgClass,
    UserAvatarComponent,
    NgForOf
  ],
  templateUrl: './admin-router.component.html',
  styleUrls: ['./admin-router.component.scss']
})
export class AdminRouterComponent {
  protected securityService: SecurityService = inject(SecurityService);
  protected sideNav: AdminSideNav[] = [
    { title: 'common.admin.nav.dashboard', icon: 'fa-home', link: AppNode.DASHBOARD },
    { title: 'common.admin.nav.care', icon: 'fa-hand-holding-heart', link: AppNode.MANAGE_CARE },
    { title: 'common.admin.nav.appointment', icon: 'fa-calendar-check', link: AppNode.MANAGE_APPOINTMENT },
    { title: 'common.admin.nav.customer', icon: 'fa-users', link: AppNode.MANAGE_CUSTOMER },
    { title: 'common.admin.nav.business-hours', icon: 'fa-thin fa-clock', link: AppNode.MANAGE_BUSINESS_HOURS },
    { title: 'common.admin.nav.holiday', icon: 'fa-thin fa-face-smile-relaxed', link: AppNode.MANAGE_HOLIDAY },
  ];

  protected clinic_name: string = "admin-feature.admin-router.name"
  protected log_out: string = "admin-feature.admin-router.logout"
  public isSidenavHidden: boolean = false;

  constructor() {
    this.securityService.fetchProfile(this.securityService.isAuth$());
  }

  protected navigate(link: string): void {
    this.securityService.navigate(link);
  }

  toggleSidenav(): void {
    this.isSidenavHidden = !this.isSidenavHidden;
  }

  logout(): void {
    this.securityService.logout();
    this.navigate(AppNode.HOME);
  }

  protected readonly SecurityService = SecurityService;
}
