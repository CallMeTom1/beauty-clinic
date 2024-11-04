import {Component, computed, inject} from '@angular/core';
import {SecurityService} from "@feature-security";
import {AppNode} from "@shared-routes";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ContactCardComponent} from "../contact-card/contact-card.component";
import {RouterLink} from "@angular/router";
import {DayOfWeekEnum} from "../../../business-hours/day-of-week.enum";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    TranslateModule,
    NgOptimizedImage,
    ContactCardComponent,
    RouterLink,
    NgIf,
    NgForOf
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  protected readonly securityService: SecurityService = inject(SecurityService);
  protected logoSrc: string = 'assets/pictures/dark-logo.png';

  protected currentYear = new Date().getFullYear()

  constructor() {
    this.securityService.fetchBusinessHours().subscribe();
    this.securityService.fetchClinic().subscribe();
  }

  clinic = computed(() => {
    return this.securityService.clinic$();
  });

  openHours = computed(() => {
    return this.securityService.businessHours$()
      .sort((a, b) => Number(a.day_of_week) - Number(b.day_of_week));
  });

  getDayLabel(day: DayOfWeekEnum): string {
    const days: { [key in DayOfWeekEnum]: string } = {
      [DayOfWeekEnum.MONDAY]: 'Lundi',
      [DayOfWeekEnum.TUESDAY]: 'Mardi',
      [DayOfWeekEnum.WEDNESDAY]: 'Mercredi',
      [DayOfWeekEnum.THURSDAY]: 'Jeudi',
      [DayOfWeekEnum.FRIDAY]: 'Vendredi',
      [DayOfWeekEnum.SATURDAY]: 'Samedi',
      [DayOfWeekEnum.SUNDAY]: 'Dimanche'
    };
    return days[day];
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  redirectHome() {
    return this.securityService.navigate(AppNode.HOME);
  }
}
