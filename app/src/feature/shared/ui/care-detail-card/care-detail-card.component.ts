import {Component, Input} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {CareTrendCardConfig} from "../care-trend-card/care-trend-card.config";
import {CareDetailConfig} from "./care-detail.config";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-care-detail-card',
  standalone: true,
  imports: [
    TranslateModule,
    NgStyle
  ],
  templateUrl: './care-detail-card.component.html',
  styleUrl: './care-detail-card.component.scss'
})
export class CareDetailCardComponent {
  @Input() config: CareDetailConfig = {
    src : './assets/home-intro-card.png',
    title: 'home-intro-card-title',
    btnTxt: 'home-intro-card-btnTxt',
  }
}
