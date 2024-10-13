import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
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
export class HomeHeaderComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    const video = this.videoPlayer.nativeElement;
    video.muted = true; // Assurez-vous que la vidéo est muette

    video.addEventListener('canplaythrough', () => {
      video.play().catch(error => {
        console.error('Erreur de lecture automatique :', error);
      });
    });

    // Redémarrer la vidéo si elle se termine
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      video.play().catch(error => {
        console.error('Erreur lors du redémarrage de la vidéo :', error);
      });
    });
  }

}
