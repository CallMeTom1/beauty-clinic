import { Component } from '@angular/core';
import { CareHeaderComponent } from "../../component/care-header/care-header.component";
import { CareDetailConfig } from "../../../shared/ui/care-detail-card/care-detail.config";
import { TranslateModule } from "@ngx-translate/core";
import { CareCardComponent } from "../../../shared/ui/care-card/care-card.component";
import {CareDetailCardComponent} from "../../../shared/ui/care-detail-card/care-detail-card.component";

@Component({
  selector: 'app-care-page',
  standalone: true,
  imports: [
    CareHeaderComponent,
    TranslateModule,
    CareCardComponent,
    CareDetailCardComponent
  ],
  templateUrl: './care-page.component.html',
  styleUrls: ['./care-page.component.scss']
})
export class CarePageComponent {

  protected readonly title1: string = 'care-feature-care-page-title1';
  protected readonly title2: string = 'care-feature-care-page-title2';
  protected readonly diag_title: string = 'care-feature-care-page-diag-title';
  protected readonly epil_title: string = 'care-feature-care-page-epil-title';

  diagConfig: CareDetailConfig[] = [{
    src: "./assets/pictures/diagnostique.png",
    title: "care-feature-care-page-card.title1",
    btnTxt: "care-feature-care-page-card.btnTxt1",
  }];

  epilationConfig: CareDetailConfig[] = [
    {
      src: './assets/pictures/epilation-laser.png',
      title: 'care-feature-care-page-card.title2',
      btnTxt: 'care-feature-care-page-card.btnTxt1',
    },
    {
      src: './assets/pictures/epilation-laser.png',
      title: 'care-feature-care-page-card.title3',
      btnTxt: 'care-feature-care-page-card.btnTxt1',
    },
    {
      src: './assets/pictures/epilation-laser.png',
      title: 'care-feature-care-page-card.title4',
      btnTxt: 'care-feature-care-page-card.btnTxt1',
    }
  ];
}