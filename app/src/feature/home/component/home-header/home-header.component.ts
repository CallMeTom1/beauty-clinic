import { Component } from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {ContactCardComponent} from "../../../shared/ui/contact-card/contact-card.component";

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [
    TranslateModule,
    ContactCardComponent
  ],
  templateUrl: './home-header.component.html',
  styleUrl: './home-header.component.scss'
})
export class HomeHeaderComponent {
  topTitle: string = "home-feature-header-top-title";
  title1: string = "home-feature-header-home-title1";
  title2: string = "home-feature-header-home-title2";
  title3: string = "home-feature-header-home-title3";
  careBtn: string = "home-feature-header-care-btn";
  appointmentBtn: string = "home-feature-header-appointment-btn";
}
