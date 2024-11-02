import {Component, computed, effect, inject, Input, Signal} from '@angular/core';
import {SecurityService, UserUtils} from "@feature-security";
import {NgIf, NgStyle} from "@angular/common";
import {User} from "../../../security/data/model/user";

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

  protected securityService: SecurityService = inject(SecurityService);
  protected profile: User = UserUtils.getEmpty();

  constructor() {
    effect(() => {
      this.profile = this.securityService.account$()
    });
  }


}
