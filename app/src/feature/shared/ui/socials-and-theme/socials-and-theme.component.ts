import { Component } from '@angular/core';
import { SocialsConfig } from './socials.interface';
import {ThemeTogglerComponent} from "@shared-ui";

@Component({
  selector: 'app-socials-and-theme',
  standalone: true,
  imports: [
    ThemeTogglerComponent
  ],
  templateUrl: './socials-and-theme.component.html',
  styleUrls: ['./socials-and-theme.component.scss']
})
export class SocialsAndThemeComponent {

  socialsConfig: SocialsConfig[] = [
    {
      icon: '/assets/icon/facebook.svg', // Ajout du '/' au début
      link: 'https://www.facebook.com',
      alt: 'facebook icon'
    },
    {
      icon: '/assets/icon/linkedin.svg', // Remplacer l'icône si nécessaire
      link: 'https://www.linkedin.com', // Correction du lien
      alt: 'linkedin icon'
    },
    {
      icon: '/assets/icon/tiktok.svg', // Remplacer l'icône si nécessaire
      link: 'https://www.tiktok.com/',
      alt: 'tiktok icon'
    },
    {
      icon: '/assets/icon/instagram.svg', // Remplacer l'icône si nécessaire
      link: 'https://www.instagram.com/',
      alt: 'instagram icon'
    }
  ];
}
