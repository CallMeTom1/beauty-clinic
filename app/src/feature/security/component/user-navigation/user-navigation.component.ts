import {Component, ElementRef, HostListener, inject} from '@angular/core';
import {SecurityService} from "@feature-security";
import {RoleTransformPipe} from "@shared-ui";
import {TranslateModule} from "@ngx-translate/core";
import {AppRoutes} from "@shared-routes";
import {UserAvatarComponent} from "../../../shared/ui/user-avatar/user-avatar.component";

@Component({
  selector: 'app-user-navigation',
  standalone: true,
  imports: [
    RoleTransformPipe,
    TranslateModule,
    UserAvatarComponent
  ],
  templateUrl: './user-navigation.component.html',
  styleUrl: './user-navigation.component.scss'
})
export class UserNavigationComponent {

  protected securityService: SecurityService = inject(SecurityService);
  private elementRef: ElementRef = inject(ElementRef);

  protected dropdownOpen: boolean = false;
  protected width: string = '50px';
  protected profile: string = 'security-feature-user-nav-profile';
  protected wallet: string = 'security-feature-user-nav-wallet';
  protected logOut: string = 'security-feature-user-nav-logout';
  protected alt: string = 'security-feature-user-nav-alt'

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  navigateToProfile(): void {
    this.securityService.navigate(AppRoutes.PROFILE)
    this.dropdownOpen = false;
  }

  logout(): void {
    this.securityService.logout();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

}
