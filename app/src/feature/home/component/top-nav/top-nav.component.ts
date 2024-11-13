import {Component, inject} from '@angular/core';
import {SecurityService, UserNavigationComponent} from "@feature-security";
import {AppNode} from "@shared-routes";
import {CartNavigationComponent} from "../../../shared/ui/cart-navigation/cart-navigation.component";
import {ClinicNavComponent} from "../../../shared/ui/clinic-nav/clinic-nav.component";
import {WishlistComponent} from "../../../shared/ui/wishlist/wishlist.component";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [
    UserNavigationComponent,
    CartNavigationComponent,
    ClinicNavComponent,
    WishlistComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss'
})
export class TopNavComponent {
  protected securityService: SecurityService = inject(SecurityService);
  protected isMenuOpen: Boolean = false;
  protected activeMenuItem: string = ''; // Changé à chaîne vide pour correspondre au home

  protected navigateHome(): void {
    this.securityService.navigate(AppNode.HOME);
    this.activeMenuItem = '';
    this.closeMenu();
  }

  protected menu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  protected closeMenu(): void {
    this.isMenuOpen = false;
  }

  protected selectMenuItem(item: string): void {
    this.activeMenuItem = item;
    this.securityService.navigate(item);
    this.closeMenu();
  }
}
