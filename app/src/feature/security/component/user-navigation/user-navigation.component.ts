import {Component, effect, ElementRef, HostListener, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {SecurityService, UserUtils} from "@feature-security";
import {TranslateModule} from "@ngx-translate/core";
import {AppRoutes} from "@shared-routes";
import {UserAvatarComponent} from "../../../shared/ui/user-avatar/user-avatar.component";
import {User} from "../../data/model/user";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-user-navigation',
  standalone: true,
  imports: [
    TranslateModule,
    UserAvatarComponent,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './user-navigation.component.html',
  styleUrl: './user-navigation.component.scss'
})
export class UserNavigationComponent {

  protected securityService: SecurityService = inject(SecurityService);
  private elementRef: ElementRef = inject(ElementRef);
  protected account: User = UserUtils.getEmpty();
  protected dropdownOpen: boolean = false;
  private closeTimeout: any;

  constructor() {
    effect(() => {
      this.account = this.securityService.account$();
    });
  }

  toggleDrop(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  navigateToProfile(): void {
    this.securityService.navigate(AppRoutes.PROFILE);
    this.dropdownOpen = false;
  }

  navigateToOrders(): void {
    this.securityService.navigate('account/my-orders');
    this.dropdownOpen = false;
  }

  logout(): void {
    this.securityService.logout().subscribe();
    this.dropdownOpen = false;
  }

  navigateToSignIn(): void {
    this.securityService.navigate(AppRoutes.SIGNIN);
    this.dropdownOpen = false;
  }

  navigateToSignUp(): void {
    this.securityService.navigate(AppRoutes.SIGNUP);
    this.dropdownOpen = false;
  }

  onMouseEnter() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout); // Annule le timeout si la souris revient sur le dropdown
    }
    this.dropdownOpen = true;
  }

  onMouseLeave() {
    this.closeTimeout = setTimeout(() => {
      this.dropdownOpen = false;
    }, 300); // Délai de 300ms avant fermeture
  }

}
