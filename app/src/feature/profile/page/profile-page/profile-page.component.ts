import {Component, inject} from '@angular/core';
import {ProfileComponent, SecurityService} from "@feature-security";
import {ProfileCardComponent} from "../../component/profile-card/profile-card.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileComponent,
    ProfileCardComponent,
    NgForOf
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

  protected readonly securityService:SecurityService = inject(SecurityService);

  profileCards = [
    {
      id: 'edit-profile',
      title: 'Éditer le profil',
      description: 'Modifier vos informations personnelles et de compte.',
      icon: 'fa-solid fa-user-edit'
    },
    {
      id: 'my-orders',
      title: 'Mes commandes',
      description: 'Consulter et gérer vos commandes récentes.',
      icon: 'fa-solid fa-box'
    }
  ];

  onCardClick(cardId: string) {
    console.log('Carte cliquée avec id:', cardId);

    if (cardId === 'edit-profile') {
      this.redirectToEditProfile();
    } else if (cardId === 'my-orders') {
      this.redirectToOrders();
    }
  }

  redirectToEditProfile() {
    this.securityService.navigate('account/profile/edit-profile');  // Navigue vers la page d'édition du profil
  }

  redirectToOrders() {
    this.securityService.navigate('account/profile/orders');  // Navigue vers la page des commandes
  }

}
