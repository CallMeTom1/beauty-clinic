import {CommonModule} from "@angular/common";
import {Component, inject, OnInit} from "@angular/core";
import {RouterModule} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Language} from "@shared-core";
import {Title} from "@angular/platform-browser";
import {OverlayComponent} from "../../shared/ui/overlay-grid/overlay.component";
import {ThemeService} from "../../shared/ui/theme.service";
import {SecurityService} from "@feature-security";

@Component({ selector: 'component-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterModule, OverlayComponent],
})
export class AppComponent implements OnInit {

  private translate: TranslateService = inject(TranslateService);
  private titleService: Title = inject(Title);
  private themeService: ThemeService = inject(ThemeService);
  private title: string = 'Beauty Clinic By Françoise';
  protected securityService = inject(SecurityService);
  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.translate.setDefaultLang(Language.FR);
    this.translate.use(Language.FR);
    this.themeService.loadTheme();
  }
}
