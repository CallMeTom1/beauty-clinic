import { Component } from '@angular/core';
import {CareCardConfig} from "../../../shared/ui/care-card/care-card.config";
import {CareCardComponent} from "../../../shared/ui/care-card/care-card.component";

@Component({
  selector: 'app-care-slider',
  standalone: true,
  imports: [
    CareCardComponent
  ],
  templateUrl: './care-slider.component.html',
  styleUrl: './care-slider.component.scss'
})
export class CareSliderComponent {
  careCardConfig: CareCardConfig[] = [
    {
      src: './assets/pictures/diagnostique.png',
      title: 'home-care-card.title1',
      alt: 'quelque-chose'
    },
    {
      src: './assets/pictures/epilation.png',
      title: 'home-care-card.title2',
      alt: 'quelque-chose'

    },
    {
      src: './assets/pictures/relachement-cutane.png',
      title: 'home-care-card.title3',
      alt: 'quelque-chose'
    },
    {
      src: './assets/pictures/anti-cellulite.png',
      title: 'home-care-card.title4',
      alt: 'quelque-chose'
    },
    {
      src: './assets/pictures/radio-frequence.png',
      title: 'home-care-card.title5',
      alt: 'quelque-chose'
    },
    {
      src: './assets/pictures/peeling.png',
      title: 'home-care-card.title6',
      alt: 'quelque-chose'
    },
    {
      src: './assets/pictures/rajeunissement.png',
      title: 'home-care-card.title7',
      alt: 'quelque-chose'
    },
  ]
}
