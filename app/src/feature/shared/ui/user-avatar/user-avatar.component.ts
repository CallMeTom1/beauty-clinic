import {Component, computed, inject, Input, Signal} from '@angular/core';
import {SecurityService} from "@feature-security";
import {NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [
    NgStyle,
    NgIf
  ],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent {
  @Input() alt: string = 'avatar';
  @Input() width: string = '32px';
  @Input() height: string = '32px';

  private securityService: SecurityService = inject(SecurityService);

  profileImage$: Signal<string | null> = computed(() => {
    const account = this.securityService.account$();
    if (account.profileImage && account.profileImage.length > 0) {
      // Si l'utilisateur a personnalisé son image de profil
      return `data:image/png;base64,${account.profileImage}`;
    } else if (account.profileImageUrl) {
      // Sinon, utiliser l'image Google
      return account.profileImageUrl;
    } else {
      // Sinon, utiliser null pour indiquer qu'il n'y a pas d'image
      return null;
    }
  });
}
