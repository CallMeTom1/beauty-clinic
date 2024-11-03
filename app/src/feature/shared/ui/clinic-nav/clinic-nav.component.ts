import {Component, computed} from '@angular/core';
import {SecurityService} from "@feature-security";
import {NgForOf, NgIf} from "@angular/common";
import {DayOfWeekEnum} from "../../../business-hours/day-of-week.enum";

@Component({
  selector: 'app-clinic-nav',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './clinic-nav.component.html',
  styleUrl: './clinic-nav.component.scss'
})
export class ClinicNavComponent {
  isDropdownOpen = false;

  constructor(private securityService: SecurityService) {
    this.securityService.fetchBusinessHours().subscribe();
    this.securityService.fetchClinic().subscribe();
  }

  openHours = computed(() => {
    return this.securityService.businessHours$()
      .sort((a, b) => Number(a.day_of_week) - Number(b.day_of_week));
  });

  clinic = computed(() => {
    return this.securityService.clinic$();
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
    return time.substring(0, 5); // Convertit "09:00:00" en "09:00"
  }

  onMouseEnter(): void {
    this.isDropdownOpen = true;
  }

  onMouseLeave(): void {
    this.isDropdownOpen = false;
  }
}
