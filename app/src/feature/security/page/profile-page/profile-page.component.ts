import {Component} from '@angular/core';
import {ProfileComponent} from "@feature-security";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

}
