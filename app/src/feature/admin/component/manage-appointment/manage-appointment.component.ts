import {Component, inject, signal, WritableSignal} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {SecurityService} from "@feature-security";
import {FormcontrolSimpleConfig, FormError, handleFormError} from "@shared-ui";
import {
  CreateAppointmentAdminUserDoesNotExist
} from "../../../security/data/payload/appointment/create-appointment-admin-user-does-not-exist.payload";
import {EditApppointmentNotePayload} from "../../../security/data/payload/appointment/edit-apppointment-note.payload";
import {
  UpdateAppointmentStatusPayload
} from "../../../security/data/payload/appointment/update-appointment-status.payload";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Appointment} from "../../../appointment/data/model/appointment.business";
import {Care} from "../../../care/data/model/care.business";
import {map} from "rxjs";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";

@Component({
  selector: 'app-manage-appointment',
  standalone: true,
  imports: [
    TranslateModule,
    CurrencyPipe,
    ModalComponent,
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './manage-appointment.component.html',
  styleUrl: './manage-appointment.component.scss'
})
//todo ajouter un type
//todo rajouter numéro de la personne
export class ManageAppointmentComponent {

  protected showCreateModal: boolean = false;
  protected showEditNoteModal: boolean = false;
  protected readonly title: string =   "admin-feature.admin.manage-appointment.title";
  protected readonly add_appointment: string = "admin-feature.admin.manage-appointment.add";
  protected readonly modal_add_title: string = "admin-feature.admin.manage-appointment.modal.add.title";
  protected readonly col_care_name: string = "admin-feature.admin.manage-appointment.col_care_name";
  protected readonly col_lastname: string = "admin-feature.admin.manage-appointment.col_lastname";
  protected readonly col_firstname: string = "admin-feature.admin.manage-appointment.col_firstname";
  protected readonly col_start_time: string = "admin-feature.admin.manage-appointment.col_start_time";
  protected readonly col_end_time: string = "admin-feature.admin.manage-appointment.col_end_time";
  protected readonly col_price: string = "admin-feature.admin.manage-appointment.col_price";
  protected readonly col_notes: string = "admin-feature.admin.manage-appointment.col_notes";
  protected readonly col_modifier_note: string = "admin-feature.admin.manage-appointment.col_modifier_note";
  protected readonly col_confirmer: string = "admin-feature.admin.manage-appointment.col_confirmer";
  protected readonly col_annuler: string = "admin-feature.admin.manage-appointment.col_annuler";

  private readonly translateService: TranslateService = inject(TranslateService);
  protected readonly securityService: SecurityService = inject(SecurityService);
  public formErrorEditNote$: WritableSignal<FormError[]> = signal([]);
  public categories: string[] = [];
  private currentAppointmentId: string | null = null;

  private createCareAdmin: CreateAppointmentAdminUserDoesNotExist = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    care_id: '',
    start_time: ''
  };

  private updateNote: EditApppointmentNotePayload = {
    appointment_id: '',
    note: ''
  };

  public formGroupEditNote: FormGroup = new FormGroup(
    {
      note: new FormControl("", Validators.required),
    }
  )

  public formGroupCreateAppointment: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^[+]?[0-9]{10,13}$/)]),
    care_id: new FormControl('', Validators.required),
    start_time: new FormControl('', Validators.required)
  });

  public selectedCategory: string | null = null;

  public formControlEditNoteConfig: FormcontrolSimpleConfig[] = [
    {
      label: 'appointment.form.note',
      formControl: this.formGroupEditNote.get('note') as FormControl,
      inputType: 'text',
      placeholder: 'appointment.form.enter_note'
    }
  ].map(item => ({
    ...item,
    label: this.translateService.instant(item.label),
    placeholder: this.translateService.instant(item.placeholder),
  }));

  constructor() {
    this.securityService.fetchAppointments().subscribe();
    this.initializeCategories();
    handleFormError(this.formGroupEditNote, this.formErrorEditNote$);
  }

  private initializeCategories(): void {
    const cares: Care[] = this.securityService.cares$(); // Assuming cares$ exposes current value directly
    this.categories = Array.from(new Set(cares.map(care => care.category)));
    console.log('les catégories', this.categories)
  }

  public errorEdit(): FormError[] {
    return this.formErrorEditNote$();
  }

  onSubmitEditNote(): void {
    if (this.formGroupEditNote.valid && this.currentAppointmentId) {
      const formValue = this.formGroupEditNote.value;
      const payload: EditApppointmentNotePayload = {
        appointment_id: this.currentAppointmentId,
        note: formValue.note
      };

      this.securityService.updateAppointmentNote(payload).subscribe({
        next: (response) => {
          this.handleAppointmentUpdate(response.data as Appointment);
          this.showEditNoteModal = false; // Close the modal upon successful update
        },
        error: (error) => {
          console.error('Failed to update appointment note:', error);
          // Handle error (show user-friendly error message)
        }
      });
    } else {
      console.error('Form is invalid or appointment ID is missing');
    }
  };

  onSubmitCreateAppointment(): void {
    if (this.formGroupCreateAppointment.valid) {
      const appointmentData: CreateAppointmentAdminUserDoesNotExist = this.formGroupCreateAppointment.value;
      this.securityService.createAppointmentAdmin(appointmentData).subscribe({
        next: () => console.log('Appointment successfully created.'),
        error: (error) => console.error('Error creating appointment:', error)
      });
    } else {
      console.error('Form is invalid');
    }
  }

  public filteredCares: Care[] = []; // Holds cares filtered by selected category

  public onCategorySelected(event: Event): void {
    const selectedCategory = (event.target as HTMLSelectElement).value;
    this.filteredCares = this.securityService.cares$().filter(care => care.category === selectedCategory);
    this.formGroupCreateAppointment.get('care_id')?.reset(); // Reset care selection
  }



  handleAppointmentUpdate(updatedAppointment: Appointment): void {
    const appointments: Appointment[] = [...this.securityService.appointment$()];
    const index = appointments.findIndex(app => app.appointment_id === updatedAppointment.appointment_id);

    if (index > -1) {
      appointments[index] = updatedAppointment; // Replace the entire appointment with the updated one
      this.securityService.appointment$.set(appointments); // Update the BehaviorSubject with the new appointments array
    } else {
      console.error('Failed to find the updated appointment in the local list');
      // Consider how to handle this case, such as reloading the list or showing an error
    }
  }

  loadAppointmentDetails(appointment: Appointment): void {
    this.currentAppointmentId = appointment.appointment_id; // Set the current appointment ID
    this.formGroupEditNote.patchValue({
      note: appointment.notes  // Load the current note into the form
    });
    this.showEditNoteModal = true; // Open the modal for editing
  }

  protected confirmAppointment(appointment_id: string): void {
    const payload: UpdateAppointmentStatusPayload = {
      appointment_id: appointment_id
    }
    this.securityService.confirmAppointment(payload).subscribe();
  };

  protected cancelAppointment(appointment_id: string): void {
    const payload: UpdateAppointmentStatusPayload = {
      appointment_id: appointment_id
    }
    this.securityService.cancelAppointment(payload).subscribe();
  };




  //todo trouver un moyen de permmettre à l'admin de sélectionner la catégorie dans le form createCareAdmin, sélectionner
  //le soin correspondant pour obtenir son id. this.securityService.care$() (contient la liste des cares)


  sortColumn: string = '';
  sortAscending: boolean = true;


  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = true;
      this.sortColumn = column;
    }
    this.sortAppointments();
  }

  private sortAppointments(): void {
    const sortedAppointments = [...this.securityService.appointment$()].sort((a, b) => {
      const valA = a[this.sortColumn as keyof Appointment];
      const valB = b[this.sortColumn as keyof Appointment];

      if (valA! < valB!) {
        return this.sortAscending ? -1 : 1;
      }
      if (valA! > valB!) {
        return this.sortAscending ? 1 : -1;
      }
      return 0;
    });

    this.securityService.appointment$.set(sortedAppointments);
  }

}
