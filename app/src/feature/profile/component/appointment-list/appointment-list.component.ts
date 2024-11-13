import {Component, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {AppointmentStatus} from "../../../appointment/appointment-status.enum";
import {RouterLink} from "@angular/router";
import {NgClass} from "@angular/common";
import {AppRoutes} from "@shared-routes";

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss'
})
export class AppointmentListComponent implements OnInit {
  protected securityService = inject(SecurityService);
  protected readonly AppointmentStatus = AppointmentStatus;
  protected readonly statusLabels: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: 'En attente',
    [AppointmentStatus.CONFIRMED]: 'Confirmé',
    [AppointmentStatus.CANCELED]: 'Annulé',
    [AppointmentStatus.COMPLETED]: 'Terminé',
    [AppointmentStatus.SCHEDULED]: 'Planifié'
  };

  ngOnInit() {
    if (this.securityService.account$().idUser) {
      this.securityService.fetchAppointments().subscribe();
    }
  }

  getStatusClass(status: AppointmentStatus): string {
    const statusClasses: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'status-pending',
      [AppointmentStatus.CONFIRMED]: 'status-confirmed',
      [AppointmentStatus.CANCELED]: 'status-cancelled',
      [AppointmentStatus.COMPLETED]: 'status-completed',
      [AppointmentStatus.SCHEDULED]: 'status-scheduled'
    };
    return statusClasses[status] || '';
  }

  navigateToCares(): void {
    this.securityService.navigate(AppRoutes.CARES)
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateDuration(start: string, end?: string): number {
    if (!end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60)); // Duration in minutes
  }

  protected readonly AppRoutes = AppRoutes;
}
