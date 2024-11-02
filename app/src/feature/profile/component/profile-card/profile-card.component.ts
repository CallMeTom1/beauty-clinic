import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from "../../../security/data/model/user";

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() icon!: string;
  @Input() cardId!: string;  // Identifiant unique de la carte

  // Output qui émettra l'identifiant de la carte
  @Output() cardClick = new EventEmitter<string>();

  // Méthode qui émet l'événement avec l'identifiant de la carte
  onCardClick() {
    this.cardClick.emit(this.cardId);
  }
}
