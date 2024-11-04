import {Component, effect, ElementRef, inject} from '@angular/core';
import {SecurityService, UserUtils} from "@feature-security";
import {TranslateModule} from "@ngx-translate/core";
import {AppRoutes} from "@shared-routes";
import {NgIf, AsyncPipe} from "@angular/common";
import {User} from "../../data/model/user";

@Component({
  selector: 'app-user-navigation',
  standalone: true,
  imports: [
    TranslateModule,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './user-navigation.component.html',
  styleUrl: './user-navigation.component.scss'
})
export class UserNavigationComponent {
  protected securityService: SecurityService = inject(SecurityService);
  protected account: User = UserUtils.getEmpty();
  protected dropdownOpen: boolean = false;
  private closeTimeout: any;

  constructor() {
    effect(() => {
      this.account = this.securityService.account$();
    });
  }

  navigateToProfile(): void {
    this.securityService.navigate(AppRoutes.MY_ACCOUNT);
    this.dropdownOpen = false;
  }

  navigateToOrders(): void {
    this.securityService.navigate(AppRoutes.MY_ORDERS);
    this.dropdownOpen = false;
  }

  navigateToTrackOrders(): void {
    this.securityService.navigate(AppRoutes.TRACK_MY_ORDERS);
    this.dropdownOpen = false;
  }

  navigateToAppointmens(): void {
    this.securityService.navigate(AppRoutes.MY_APPOINTMENTS);
    this.dropdownOpen = false;
  }

  navigateToBookAppointment(): void {
    this.securityService.navigate(AppRoutes.APPOINTMENT);
    this.dropdownOpen = false;
  }

  navigateToMyInfo(): void {
    this.securityService.navigate(AppRoutes.MY_INFO);
    this.dropdownOpen = false;
  }

  logout(): void {
    this.securityService.logout().subscribe();
    this.dropdownOpen = false;
  }

  navigateToSignIn(): void {
    console.log('ici test')
    this.securityService.navigate(AppRoutes.SIGNIN);
    this.dropdownOpen = false;
  }

  navigateToSignUp(): void {
    this.securityService.navigate(AppRoutes.SIGNUP);
    this.dropdownOpen = false;
  }

  onMouseEnter() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
    this.dropdownOpen = true;
  }

  onMouseLeave() {
    this.closeTimeout = setTimeout(() => {
      this.dropdownOpen = false;
    }, 300);
  }
}
