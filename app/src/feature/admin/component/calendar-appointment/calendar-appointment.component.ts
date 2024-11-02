import {Component, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Appointment} from "../../../appointment/data/model/appointment.business";
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {AppointmentStatus} from "../../../appointment/appointment-status.enum";
import {ApiResponse} from "@shared-api";
import {map} from "rxjs";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";

@Component({
  selector: 'app-calendar-appointment',
  standalone: true,
  imports: [
    TranslateModule,
    DatePipe,
    CurrencyPipe,
    NgClass,
    NgForOf,
    ModalComponent,
    NgIf
  ],
  templateUrl: './calendar-appointment.component.html',
  styleUrl: './calendar-appointment.component.scss'
})
export class CalendarAppointmentComponent implements OnInit {
  protected readonly securityService = inject(SecurityService);
  protected readonly translateService = inject(TranslateService);

  protected currentDate = new Date();
  protected currentWeek: Date[] = [];
  protected appointments: Appointment[] = [];
  protected timeSlots: string[] = [];
  protected years: number[] = [];
  protected selectedYear: number;
  protected currentMonth: number;


  // Pour le modal de détails
  protected showAppointmentModal = false;
  protected selectedAppointment: Appointment | null = null;


  constructor() {
    this.selectedYear = this.currentDate.getFullYear();
    this.currentMonth = this.currentDate.getMonth();
    this.generateYears();
  }

  ngOnInit() {
    this.generateTimeSlots();
    this.generateWeekDays();
    this.loadAppointments();
  }

  protected generateYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 3 }, (_, i) => currentYear - 1 + i);
  }

  protected changeYear(year: number) {
    this.selectedYear = year;
    this.currentDate.setFullYear(year);
    this.generateWeekDays();
    this.loadAppointments();
  }

  protected generateTimeSlots() {
    this.timeSlots = [];
    for (let hour = 9; hour < 19; hour++) {
      for (let minute of ['00', '30']) {
        this.timeSlots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
      }
    }
  }


  protected generateWeekDays() {
    this.currentWeek = [];
    const firstDayOfWeek = new Date(this.currentDate);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() + 1);

    for (let i = 0; i < 6; i++) { // Du lundi au samedi
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      this.currentWeek.push(day);
    }
  }

  protected loadAppointments() {
    const startOfWeek = this.currentWeek[0];
    const endOfWeek = this.currentWeek[this.currentWeek.length - 1];

    this.securityService.fetchAppointments().pipe(
      map((response: ApiResponse) => response.data as Appointment[])
    ).subscribe({
      next: (appointments: Appointment[]) => {
        // Filtrer les rendez-vous par année
        this.appointments = appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.start_time);
          return appointmentDate.getFullYear() === this.selectedYear;
        });
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des rendez-vous', error);
      }
    });
  }

  protected formatDateWithYear(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  protected isCurrentDay(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  protected getAppointmentsForSlot(date: Date, time: string): Appointment[] {
    const slotDate = new Date(date);
    const [hours, minutes] = time.split(':');
    slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.start_time);
      return appointmentDate.getTime() === slotDate.getTime();
    });
  }

  protected formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

  protected getAppointmentStatus(status: AppointmentStatus): string {
    switch(status) {
      case AppointmentStatus.SCHEDULED:
        return 'status-scheduled';
      case AppointmentStatus.CONFIRMED:
        return 'status-confirmed';
      case AppointmentStatus.COMPLETED:
        return 'status-completed';
      case AppointmentStatus.CANCELED:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  protected previousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateWeekDays();
    this.loadAppointments();
  }

  protected nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateWeekDays();
    this.loadAppointments();
  }

  protected openAppointmentDetails(appointment: Appointment) {
    this.selectedAppointment = appointment;
    this.showAppointmentModal = true;
  }

  protected handleClose() {
    this.showAppointmentModal = false;
    this.selectedAppointment = null;
  }
}
