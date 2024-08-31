import {Component, inject} from '@angular/core';
import {SecurityService} from "@feature-security";
import {AppNode} from "@shared-routes";
import {TranslateModule} from "@ngx-translate/core";
import {NgOptimizedImage} from "@angular/common";
import {ContactCardComponent} from "../contact-card/contact-card.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    TranslateModule,
    NgOptimizedImage,
    ContactCardComponent
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  protected readonly securityService: SecurityService = inject(SecurityService);

  protected logoSrc: string = 'assets/pictures/dark-logo.png';


  redirectHome(){
    return this.securityService.navigate(AppNode.HOME)
  }
}
