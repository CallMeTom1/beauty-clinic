import {Component, inject} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {JsonPipe, NgClass, NgOptimizedImage} from "@angular/common";
import {ThemeTogglerComponent} from "@shared-ui";
import {SecurityService, UserNavigationComponent} from "@feature-security";
import {headerNav} from "@feature-home";
import {AppNode, AppRoutes} from "@shared-routes";


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
    NgOptimizedImage
  ],
  styleUrl: './home-router.component.scss'
})
export class HomeRouterComponent {

  protected securityService: SecurityService = inject(SecurityService);

  protected brand: string = 'Beauty Clinic By Françoise';
  protected signinBtn: string = 'home-feature-nav-login-btn';
  protected signupBtn: string = 'home-feature-nav-signup-btn';
  protected logoSrc: string = 'assets/pictures/dark-logo.png';
  protected width: string= '50';
  protected width_footer: string= '40';
  protected height_footer: string= '30';
  protected height: string= '50';
  protected footer: string ='home-feature-copyright';
  protected alt: string='home-feature-nav-alt';
  protected menu: headerNav[] = [
    { title: 'common.nav.swap', link: AppNode.HOME },
    { title: 'common.nav.market', link: AppNode.HOME },
    { title: 'common.nav.trade', link: AppNode.HOME },
    { title: 'common.nav.subscription', link: AppNode.HOME },
    { title: 'common.nav.forum', link: AppNode.HOME }
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
