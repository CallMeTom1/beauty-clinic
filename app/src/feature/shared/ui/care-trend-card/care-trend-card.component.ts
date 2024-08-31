import {Component, Input} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {CareTrendCardConfig} from "./care-trend-card.config";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-care-trend-card',
  standalone: true,
  imports: [
    TranslateModule,
    NgStyle
  ],
  templateUrl: './care-trend-card.component.html',
  styleUrl: './care-trend-card.component.scss'
})
export class CareTrendCardComponent {
  @Input() config: CareTrendCardConfig = {
    src : './assets/home-intro-card.png',
    title: 'home-intro-card-title',
    btnTxt: 'home-intro-card-btnTxt',
  }
}
