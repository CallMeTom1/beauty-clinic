import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {ContactCardComponent} from "../../../shared/ui/contact-card/contact-card.component";
import {VideoSlideComponent} from "../video-slide/video-slide.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [
    TranslateModule,
    ContactCardComponent,
    VideoSlideComponent,
    NgIf,
    NgForOf
  ],
  templateUrl: './home-header.component.html',
  styleUrl: './home-header.component.scss'
})
export class HomeHeaderComponent {


  slides = [0, 1, 2]; // Représente le nombre de slides
  currentSlide = 0;

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  previousSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

}
