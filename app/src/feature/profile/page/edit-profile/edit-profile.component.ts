import { Component } from '@angular/core';
import {EditProfileFormComponent} from "../../component/edit-profile-form/edit-profile-form.component";
import {PasswordFormComponent} from "../../component/password-form/password-form.component";

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    EditProfileFormComponent,
    PasswordFormComponent
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {

}
