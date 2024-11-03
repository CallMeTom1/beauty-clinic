import {Component, inject} from '@angular/core';
import {ProfileComponent, SecurityService} from "@feature-security";
import {ProfileCardComponent} from "../../component/profile-card/profile-card.component";
import {NgForOf} from "@angular/common";
import {Router} from "@angular/router";
import {OrderListComponent} from "../../component/order-list/order-list.component";
import {AppointmentListComponent} from "../../component/appointment-list/appointment-list.component";
import {WishlistListComponent} from "../../component/wishlist-list/wishlist-list.component";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileComponent,
    ProfileCardComponent,
    NgForOf,
    OrderListComponent,
    AppointmentListComponent,
    WishlistListComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

  protected securityService: SecurityService = inject(SecurityService);
  private router: Router = inject(Router);

  navigateToSignIn(): void {
    this.router.navigate(['/auth/signin']);
  }

  navigateToSection(section: string): void {
    this.router.navigate([`/profile/${section}`]);
  }

}
