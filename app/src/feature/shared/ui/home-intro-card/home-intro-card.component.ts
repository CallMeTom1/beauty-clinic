import {Component, Input} from '@angular/core';
import {HomeIntroConfigCard} from "./home-intro-config.interface";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-home-intro-card',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './home-intro-card.component.html',
  styleUrl: './home-intro-card.component.scss'
})
export class HomeIntroCardComponent {
 @Input() config: HomeIntroConfigCard = {
   src : './assets/pictures/woman-care.png',
   title: 'home-intro-card-title',
   description: 'home-intro-card-description',
   btnTxt: 'home-intro-card-btnTxt',
 }
}
