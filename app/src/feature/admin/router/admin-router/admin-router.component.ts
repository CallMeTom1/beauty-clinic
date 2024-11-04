import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AdminSideNav } from "../../data/interface/admin-side-nav.interface";
import {AppNode, AppRoutes} from "@shared-routes";
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
    { title: 'common.admin.nav.dashboard', icon: 'fa-home', link: AppRoutes.DASHBOARD },
    { title: 'common.admin.nav.clinic', icon: 'fa-thin fa-business-time', link: AppRoutes.MANAGE_CLINIC },
    { title: 'common.admin.nav.product', icon: 'fa-hand-holding-heart', link: AppRoutes.MANAGE_PRODUCT },
    { title: 'common.admin.nav.order', icon: 'fa-thin fa-boxes-stacked', link: AppRoutes.MANAGE_ORDER },
    { title: 'common.admin.nav.care', icon: 'fa-hand-holding-heart', link: AppRoutes.MANAGE_CARE },
    { title: 'common.admin.nav.appointment', icon: 'fa-calendar-check', link: AppRoutes.MANAGE_APPOINTMENT },
    { title: 'common.admin.nav.customer', icon: 'fa-users', link: AppRoutes.MANAGE_CUSTOMER }
  ];
  /*
  <i class="fa-thin fa-boxes-stacked"></i>
   */

  protected clinic_name: string = "admin-feature.admin-router.name"
  protected log_out: string = "admin-feature.admin-router.logout"
  public isSidenavHidden: boolean = true;

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
