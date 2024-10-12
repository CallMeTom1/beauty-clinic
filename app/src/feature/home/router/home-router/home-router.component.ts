import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from "@angular/core";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {JsonPipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ThemeTogglerComponent} from "@shared-ui";
import {SecurityService, UserNavigationComponent} from "@feature-security";
import {headerNav} from "@feature-home";
import {AppNode, AppRoutes} from "@shared-routes";
import {FooterComponent} from "../../../shared/ui/footer/footer.component";
import {ThemeService} from "../../../shared/ui/theme.service";
import {SocialsAndThemeComponent} from "../../../shared/ui/socials-and-theme/socials-and-theme.component";
import {TopNavMobileComponent} from "../../component/top-nav-mobile/top-nav-mobile.component";

@Component({
  selector: 'app-home-router',
  standalone: true,
  templateUrl: './home-router.component.html',
  imports: [
    RouterOutlet,
    ThemeTogglerComponent,
    UserNavigationComponent,
    TranslateModule,
    NgClass,
    JsonPipe,
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    FooterComponent,
    SocialsAndThemeComponent,
    NgForOf,
    TopNavMobileComponent,
    NgIf
  ],
  styleUrl: './home-router.component.scss'
})
export class HomeRouterComponent {

}
