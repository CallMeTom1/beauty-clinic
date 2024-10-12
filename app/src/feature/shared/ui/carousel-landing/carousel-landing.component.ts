import {Component, HostListener} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ButtonComponent} from "../button/button.component";
//todo reparer bug
@Component({
  selector: 'app-carousel-landing',
  standalone: true,
  imports: [
    NgForOf,
    ButtonComponent,
    NgIf
  ],
  templateUrl: './carousel-landing.component.html',
  styleUrl: './carousel-landing.component.scss'
})
export class CarouselLandingComponent {
  slides = [
    { title: 'Un diagnostique sur mesure gratuit',
      content: 'Identifiez les soins parfaitement adaptés à votre peau et à votre style.\n',
      button: { text: 'Découvrir', action: () => this.reserve() }
    },
    { title: 'Découvrer les soins d epilations laser',
      content: 'Identifiez les soins parfaitement adaptés à votre peau et à votre style.',
      button: { text: 'Découvrir', action: () => this.reserve() }
    },
    { title: 'PRODUITS EN PROMOTIONS',
      content: 'Identifiez les soins parfaitement adaptés à votre peau et à votre style.',
      button: { text: 'Découvrir', action: () => this.reserve() }
    },
  ];

  protected reserve(): void {

  }

  currentRotation = 0;
  touchStartX = 0;
  touchEndX = 0;

  goToSlide(index: number) {
    // Correction du calcul de rotation pour passer au slide souhaité
    this.currentRotation = -120 * index;
  }

  isActive(index: number): boolean {
    // Normalisation de la rotation actuelle pour éviter les valeurs négatives
    const normalizedRotation = ((this.currentRotation % 360) + 360) % 360;
    // Calcul de la rotation attendue pour le slide
    const expectedRotation = ((-120 * index) % 360 + 360) % 360;
    return Math.abs(normalizedRotation - expectedRotation) < 1; // Comparaison avec une petite marge d'erreur
  }


  // Capture du début du swipe
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  // Capture de la fin du swipe et calcul de la direction
  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  // Calcul de la direction du swipe
  handleSwipe() {
    const minSwipeDistance = 50; // distance minimale pour être considéré comme un swipe
    if (this.touchEndX < this.touchStartX - minSwipeDistance) {
      this.nextSlide();
    }
    if (this.touchEndX > this.touchStartX + minSwipeDistance) {
      this.previousSlide();
    }
  }

  nextSlide() {
    this.currentRotation -= 120; // Rotation vers la gauche pour avancer au prochain slide
  }

  previousSlide() {
    this.currentRotation += 120;
  }
}
