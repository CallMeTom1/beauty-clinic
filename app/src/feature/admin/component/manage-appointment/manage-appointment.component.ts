import {Component, inject} from "@angular/core";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomEuroPipe, FormcontrolSimpleConfig} from "@shared-ui";
import {SecurityService} from "@feature-security";
import {Appointment} from "../../../appointment/data/model/appointment.business";
import {Care} from "../../../security/data/model/care/care.business";
import {
  CreateAppointmentAdminUserDoesNotExist
} from "../../../security/data/payload/appointment/create-appointment-admin-user-does-not-exist.payload";
import {
  UpdateAppointmentStatusPayload
} from "../../../security/data/payload/appointment/update-appointment-status.payload";
import {AppointmentStatus} from "../../../appointment/appointment-status.enum";

@Component({
  selector: 'app-manage-appointment',
  standalone: true,
  imports: [
    TranslateModule,
    CurrencyPipe,
    ModalComponent,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NgClass,
    CustomEuroPipe,
    DatePipe
  ],
  templateUrl: './manage-appointment.component.html',
  styleUrl: './manage-appointment.component.scss'
})
//todo ajouter un type
//todo rajouter numéro de la personne
export class ManageAppointmentComponent {
  protected readonly securityService = inject(SecurityService);
  protected readonly translateService = inject(TranslateService);
  protected readonly Math = Math;


  // Modal states
  protected showCreateModal = false;
  protected showEditNoteModal = false;
  protected currentAppointment: Appointment | null = null;

  // Data
  protected categories: string[] = [];
  protected filteredCares: Care[] = [];

  // Create Appointment Form
  protected createAppointmentForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[+]?[0-9]{10,13}$/)
    ]),
    care_id: new FormControl('', [Validators.required]),
    start_time: new FormControl('', [Validators.required])
  });

  // Edit Note Form
  protected editNoteForm = new FormGroup({
    notes: new FormControl('', [Validators.required])
  });

  // Form configurations for floating labels
  protected createAppointmentFormConfigs: FormcontrolSimpleConfig[] = [];

  constructor() {
    this.initializeFormConfigs();
  }

  ngOnInit(): void {
    this.securityService.fetchAppointments().subscribe();
    this.initializeCategories();
  }

  private initializeFormConfigs(): void {
    this.createAppointmentFormConfigs = [
      {
        label: this.translateService.instant('appointment.form.first_name'),
        formControl: this.createAppointmentForm.get('firstName') as FormControl,
        inputType: 'text',
        placeholder: this.translateService.instant('appointment.form.enter_first_name')
      },
      {
        label: this.translateService.instant('appointment.form.last_name'),
        formControl: this.createAppointmentForm.get('lastName') as FormControl,
        inputType: 'text',
        placeholder: this.translateService.instant('appointment.form.enter_last_name')
      },
      {
        label: this.translateService.instant('appointment.form.phone_number'),
        formControl: this.createAppointmentForm.get('phoneNumber') as FormControl,
        inputType: 'tel',
        placeholder: this.translateService.instant('appointment.form.enter_phone_number')
      },
      {
        label: this.translateService.instant('appointment.form.start_time'),
        formControl: this.createAppointmentForm.get('start_time') as FormControl,
        inputType: 'datetime-local',
        placeholder: ''
      }
    ];
  }

  private initializeCategories(): void {
    const cares = this.securityService.cares$();
    // Utiliser la propriété categories de Care
    this.categories = Array.from(
      new Set(
        cares.flatMap(care => care.categories.map(cat => cat.name))
      )
    );
  }

  protected onCategorySelected(event: Event): void {
    const selectedCategory = (event.target as HTMLSelectElement).value;
    this.filteredCares = this.securityService.cares$()
      .filter(care =>
        care.categories.some(category => category.name === selectedCategory)
      );
    this.createAppointmentForm.get('care_id')?.reset();
  }

  protected openCreateModal(): void {
    this.showCreateModal = true;
    this.createAppointmentForm.reset();
  }

  protected openEditNoteModal(appointment: Appointment): void {
    this.currentAppointment = appointment;
    this.editNoteForm.patchValue({ notes: appointment.notes || '' });
    this.showEditNoteModal = true;
  }

  protected closeModals(): void {
    this.showCreateModal = false;
    this.showEditNoteModal = false;
    this.currentAppointment = null;
  }

  protected onSubmitCreateAppointment(): void {
    if (this.createAppointmentForm.valid) {
      const payload: CreateAppointmentAdminUserDoesNotExist = this.createAppointmentForm.value as CreateAppointmentAdminUserDoesNotExist;

      this.securityService.createAppointmentAdmin(payload).subscribe({
        next: () => {
          this.closeModals();
          this.securityService.fetchAppointments().subscribe();
        },
        error: (error) => console.error('Error creating appointment:', error)
      });
    }
  }

  protected onSubmitEditNote(): void {
    if (this.editNoteForm.valid && this.currentAppointment) {
      const payload = {
        appointment_id: this.currentAppointment.appointment_id,
        note: this.editNoteForm.get('notes')?.value
      };

      this.securityService.updateAppointmentNote(payload).subscribe({
        next: () => {
          this.closeModals();
          this.securityService.fetchAppointments().subscribe();
        },
        error: (error) => console.error('Error updating note:', error)
      });
    }
  }

  protected confirmAppointment(appointmentId: string): void {
    const payload: UpdateAppointmentStatusPayload = { appointment_id: appointmentId };
    this.securityService.confirmAppointment(payload).subscribe({
      next: () => this.securityService.fetchAppointments().subscribe(),
      error: (error) => console.error('Error confirming appointment:', error)
    });
  }

  protected cancelAppointment(appointmentId: string): void {
    const payload: UpdateAppointmentStatusPayload = { appointment_id: appointmentId };
    this.securityService.cancelAppointment(payload).subscribe({
      next: () => this.securityService.fetchAppointments().subscribe(),
      error: (error) => console.error('Error canceling appointment:', error)
    });
  }

  // Sorting functionality
  protected sortColumn: string = '';
  protected sortAscending: boolean = true;

  protected toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
    this.sortAppointments();
  }

  private sortAppointments(): void {
    const appointments = [...this.securityService.appointment$()];
    const sortedAppointments = appointments.sort((a, b) => {
      let valueA = this.getNestedValue(a, this.sortColumn);
      let valueB = this.getNestedValue(b, this.sortColumn);

      if (valueA < valueB) return this.sortAscending ? -1 : 1;
      if (valueA > valueB) return this.sortAscending ? 1 : -1;
      return 0;
    });

    this.securityService.appointment$.set(sortedAppointments);
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) =>
      current ? current[key] : undefined, obj);
  }

  protected readonly AppointmentStatus = AppointmentStatus;
}
