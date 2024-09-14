import { Component } from '@angular/core';
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
export class HomeHeaderComponent {

}
