import {Component, inject} from "@angular/core";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {JsonPipe, NgClass, NgOptimizedImage} from "@angular/common";
import {ThemeTogglerComponent} from "@shared-ui";
import {SecurityService, UserNavigationComponent} from "@feature-security";
import {headerNav} from "@feature-home";
import {AppNode, AppRoutes} from "@shared-routes";
import {FooterComponent} from "../../../shared/ui/footer/footer.component";

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
    FooterComponent
  ],
  styleUrl: './home-router.component.scss'
})
export class HomeRouterComponent {

  protected securityService: SecurityService = inject(SecurityService);

  protected title1: string = 'Beauty Clinic';
  protected title2: string = 'By Françoise';
  protected appointmentBtn: string = 'home-feature-take-appointment-btn';
  protected brand: string = 'Beauty Clinic By Françoise';
  protected signinBtn: string = 'home-feature-nav-login-btn';
  protected signupBtn: string = 'home-feature-nav-signup-btn';
  protected logoSrc: string = 'assets/pictures/dark-logo.png';
  protected width: string= '100';
  protected width_footer: string= '40';
  protected height_footer: string= '30';
  protected height: string= '100';
  protected footer: string ='home-feature-copyright';
  protected alt: string='home-feature-nav-alt';
  protected menu: headerNav[] = [
    { title: 'common.nav.home', link: AppNode.HOME },
    { title: 'common.nav.care', link: AppNode.CARE },
    { title: 'common.nav.contact', link: AppNode.CONTACT },
  ];
  menuActive: boolean = false;
  protected currentYear: number = new Date().getFullYear();

  constructor() {
    this.securityService.fetchProfile(this.securityService.isAuth$());
  }

  protected navigate(link: string): void {
    this.securityService.navigate(link);
    this.toggleMenu();
  }

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }

  redirectHome(): void {
    this.securityService.navigate(AppNode.REDIRECT_TO_PUBLIC);
  }

  redirectSignin(): void {
    this.securityService.navigate(AppRoutes.SIGNIN);
  }

  redirectSignup(): void {
    this.securityService.navigate(AppRoutes.SIGNUP);
  }
}
