import {Component, ElementRef, HostListener, inject} from '@angular/core';
import {SecurityService} from "@feature-security";
import {TranslateModule} from "@ngx-translate/core";
import {AppRoutes} from "@shared-routes";
import {UserAvatarComponent} from "../../../shared/ui/user-avatar/user-avatar.component";

@Component({
  selector: 'app-user-navigation',
  standalone: true,
  imports: [
    TranslateModule,
    UserAvatarComponent
  ],
  templateUrl: './user-navigation.component.html',
  styleUrl: './user-navigation.component.scss'
})
export class UserNavigationComponent {

  protected securityService: SecurityService = inject(SecurityService);
  private elementRef: ElementRef = inject(ElementRef);

  protected dropOpen: boolean = false;
  protected width: string = '50px';
  protected profile: string = 'security-feature-user-nav-profile';
  protected wallet: string = 'security-feature-user-nav-wallet';
  protected logOut: string = 'security-feature-user-nav-logout';
  protected alt: string = 'security-feature-user-nav-alt'

  toggleDrop(): void {
    if (!this.securityService.isAuth$()) {
      this.securityService.navigate(AppRoutes.SIGNIN);
    } else {
      this.dropOpen = !this.dropOpen;
    }
  }

  navigateToProfile(): void {
    this.securityService.navigate(AppRoutes.PROFILE)
    this.dropOpen = false;
  }

  logout(): void {
    this.securityService.logout().subscribe();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropOpen = false;
    }
  }

}
