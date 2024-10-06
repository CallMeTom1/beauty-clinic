import { Component } from '@angular/core';
import {ResetPasswordComponent} from "../../component/reset-password/reset-password.component";

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [
    ResetPasswordComponent
  ],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss'
})
export class ResetPasswordPageComponent {

}
