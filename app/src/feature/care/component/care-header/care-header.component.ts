import { Component } from '@angular/core';
import {ContactCardComponent} from "../../../shared/ui/contact-card/contact-card.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-care-header',
  standalone: true,
  imports: [
    ContactCardComponent,
    TranslateModule
  ],
  templateUrl: './care-header.component.html',
  styleUrl: './care-header.component.scss'
})
export class CareHeaderComponent {
  protected readonly topTitle: string = 'care-feature-header-title';
  protected readonly title1: string = 'care-feature-header-text';
  protected readonly appointmentBtn: string = 'care-feature-header-btn';

}
