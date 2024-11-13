import {AfterViewInit, Component, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {SecurityService} from "@feature-security";
import {AppRoutes} from "@shared-routes";

@Component({
  selector: 'app-video-slide',
  standalone: true,
  imports: [],
  templateUrl: './video-slide.component.html',
  styleUrl: './video-slide.component.scss'
})
export class VideoSlideComponent implements AfterViewInit{
  protected readonly securityService: SecurityService = inject(SecurityService);
  @Input() videoUrl!: string;
  @Input() title: string= 'IZZY BEAUTY';
  @Input() text: string = 'Profitez des meilleurs soins esthétiques à Liège et commandez vos produits de beauté en ligne.';
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

  navigateToCare(): void {
    this.securityService.navigate(AppRoutes.CARES)
  }

  navigateToProduct(): void {
    this.securityService.navigate(AppRoutes.PRODUCTS);
  }
}
