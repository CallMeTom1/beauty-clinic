import { Component } from '@angular/core';
import {SocialsAndThemeComponent} from "../../../shared/ui/socials-and-theme/socials-and-theme.component";
import {ForgotPasswordComponent} from "../../component/forgot-password/forgot-password.component";

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [
    SocialsAndThemeComponent,
    ForgotPasswordComponent
  ],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss'
})
export class ForgotPasswordPageComponent {

}
