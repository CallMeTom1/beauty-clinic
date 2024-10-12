import {Component, inject} from '@angular/core';
import {SecurityService, UserNavigationComponent} from "@feature-security";
import {AppNode} from "@shared-routes";

@Component({
  selector: 'app-top-nav-mobile',
  standalone: true,
  imports: [
    UserNavigationComponent
  ],
  templateUrl: './top-nav-mobile.component.html',
  styleUrl: './top-nav-mobile.component.scss'
})
export class TopNavMobileComponent {
  protected securityService: SecurityService = inject(SecurityService);
  protected isMenuOpen: Boolean = false;
  protected activeMenuItem: string = 'home'; // Par défaut, 'home' est sélectionné



  protected navigateHome(): void {
    this.securityService.navigate(AppNode.HOME)
    this.selectMenuItem('home');
  }
  protected menu(): void {
    this.isMenuOpen ? this.isMenuOpen = false : this.isMenuOpen = true;
  }
  protected closeMenu(): void {
    this.isMenuOpen = false;
  }


  protected selectMenuItem(item: string): void {
    this.activeMenuItem = item;
    this.closeMenu();
    // Ajoutez ici la logique de navigation si nécessaire
    // Par exemple : this.securityService.navigate(AppNode[item.toUpperCase()]);
  }


}
