import {Component, inject} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {ProgressStepsComponent} from "../../shared/ui/progress-steps/progress-steps.component";
import {SecurityService} from "@feature-security";
import {AppNode} from "@shared-routes";

@Component({
  selector: 'app-cart-router',
  standalone: true,
  imports: [
    RouterOutlet,
    ProgressStepsComponent
  ],
  templateUrl: './cart-router.component.html',
  styleUrl: './cart-router.component.scss'
})
export class CartRouterComponent {
  protected readonly securityService: SecurityService = inject(SecurityService);

  protected navigateToHome(){
    this.securityService.navigate(AppNode.HOME)
  }

}
