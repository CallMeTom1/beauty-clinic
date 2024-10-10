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

  protected navigateHome(): void {
    this.securityService.navigate(AppNode.HOME)
  }
}
