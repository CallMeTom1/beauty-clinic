import {Component, inject} from '@angular/core';
import {SecurityService, UserNavigationComponent} from "@feature-security";
import {AppNode} from "@shared-routes";
import {CartNavigationComponent} from "../../../shared/ui/cart-navigation/cart-navigation.component";
import {ClinicNavComponent} from "../../../shared/ui/clinic-nav/clinic-nav.component";
import {WishlistComponent} from "../../../shared/ui/wishlist/wishlist.component";

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [
    UserNavigationComponent,
    CartNavigationComponent,
    ClinicNavComponent,
    WishlistComponent
  ],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss'
})
export class TopNavComponent {
  protected securityService: SecurityService = inject(SecurityService);
  protected isMenuOpen: Boolean = false;
  protected activeMenuItem: string = 'home'; // Par défaut, 'home' est sélectionné



  protected navigateHome(): void {
    this.securityService.navigate(AppNode.HOME)
    this.activeMenuItem = 'home';
    this.closeMenu();
  }
  protected menu(): void {
    console.log(this.isMenuOpen)
    this.isMenuOpen ? this.isMenuOpen = false : this.isMenuOpen = true;
  }
  protected closeMenu(): void {
    this.isMenuOpen = false;
  }


  protected selectMenuItem(item: string): void {
    this.activeMenuItem = item;
    this.securityService.navigate(item)
    this.closeMenu();
    // Ajoutez ici la logique de navigation si nécessaire
    // Par exemple : this.securityService.navigate(AppNode[item.toUpperCase()]);
  }


}
