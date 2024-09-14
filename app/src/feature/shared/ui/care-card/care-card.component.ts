import {Component, Input} from '@angular/core';
import {CareCardConfig} from "./care-card.config";
import {NgStyle} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-care-card',
  standalone: true,
  imports: [
    NgStyle,
    TranslateModule,
  ],
  templateUrl: './care-card.component.html',
  styleUrl: './care-card.component.scss'
})
export class CareCardComponent {
  @Input({required:true}) care!: CareCardConfig;
}
