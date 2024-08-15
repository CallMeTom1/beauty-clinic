import {Component, computed, inject, Input, Signal} from '@angular/core';
import {SecurityService} from "@feature-security";

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent {
  @Input() alt: string = 'avatar';
  @Input() width: string = '50px';
  @Input() height: string = '50px';

  private securityService: SecurityService = inject(SecurityService);

  profileImage$: Signal<string> = computed(() => {
    const profileImage = this.securityService.account$().profileImage;
    if (profileImage && profileImage.length > 0) {
      return `data:image/png;base64,${profileImage}`;
    } else {
      return './assets/default-profile.png'; // Chemin vers votre image par défaut
    }
  });
}
