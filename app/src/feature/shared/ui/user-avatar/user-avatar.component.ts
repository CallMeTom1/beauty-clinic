import {Component, computed, effect, inject, Input, Signal} from '@angular/core';
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

}
