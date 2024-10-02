import {Component, inject, signal, WritableSignal} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {SecurityService} from "@feature-security";
import {
  FormcontrolSimpleConfig,
  FormError,
  handleFormError,
  LabelWithParamComponent,
  LabelWithParamPipe
} from "@shared-ui";
import {CreateHolidayPayload} from "../../../security/data/payload/holiday/create-holiday.payload";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DeleteHolidayPayload} from "../../../security/data/payload/holiday/delete-holiday.payload";
import {Holiday} from "../../../holiday/data/model/holiday.business";
import {DatePipe} from "@angular/common";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";

@Component({
  selector: 'app-manage-holiday',
  standalone: true,
  imports: [
    TranslateModule,
    DatePipe,
    ModalComponent,
    LabelWithParamPipe,
    LabelWithParamComponent
  ],
  templateUrl: './manage-holiday.component.html',
  styleUrl: './manage-holiday.component.scss'
})
export class ManageHolidayComponent {

  protected showCreateModal: boolean = false;
  protected readonly title: string = "admin-feature.admin.manage-holiday.title";
  protected readonly add_holiday: string = "admin-feature.admin.manage-holiday.add";
  protected readonly add_holiday_interval: string = "admin-feature.admin.manage-holiday.add-interval";
  protected readonly modal_add_title: string = "admin-feature.admin.holiday.modal.add.title";
  protected readonly col_date: string = "admin-feature.admin.manage-holiday.column.date";
  protected readonly col_delete: string = "admin-feature.admin.manage-holiday.column.delete";

  private readonly translateService: TranslateService = inject(TranslateService);
  protected readonly securityService: SecurityService = inject(SecurityService);
  public formError$: WritableSignal<FormError[]> = signal([]);

  // Variables pour gérer le tri
  sortColumn: string = 'holiday_date';  // Default column to sort
  sortAscending: boolean = true;        // Default to ascending order

  private createHolidayPayload: CreateHolidayPayload = {
    holiday_date: '',
  };

  public formGroup: FormGroup = new FormGroup({
    holiday_date: new FormControl(this.createHolidayPayload.holiday_date, [
      Validators.required,
      Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)  // Format YYYY-MM-DD
    ])
  });

  public formControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: 'holiday.form.date',
      formControl: this.formGroup.get('holiday_date') as FormControl,
      inputType: 'date',
      placeholder: 'holiday.form.enter_date'
    }
  ].map(item => ({
    ...item,
    label: this.translateService.instant(item.label),
    placeholder: this.translateService.instant(item.placeholder),
  }));

  constructor() {
    this.securityService.fetchHolidays().subscribe();  // Fetch holidays on init
    handleFormError(this.formGroup, this.formError$);
  }

  public error(): FormError[] {
    return this.formError$();
  }

  onSubmitCreateHoliday() {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;
      const newHoliday: CreateHolidayPayload = {
        holiday_date: formValue.holiday_date ?? ''
      };

      this.securityService.createHoliday(newHoliday).subscribe(() => {
        this.securityService.fetchHolidays().subscribe();  // Refresh the holiday list
      });

      this.showCreateModal = false;
    } else {
      console.error('Form is invalid');
    }
  }

  deleteHoliday(holiday: Holiday): void {
    console.log('Selected holiday:', holiday);  // Debugging

    if (!holiday.holiday_date) {
      console.error('Holiday date is missing!');
      return;  // Stop if there is no date
    }

    let date: string;

    date = new Date(holiday.holiday_date).toISOString().split('T')[0];

    const payload: DeleteHolidayPayload = { holiday_date: date };
    console.log('Delete payload:', payload);  // Debugging

    this.securityService.deleteHoliday(payload).subscribe(() => {
      console.log(`Holiday on ${date} deleted successfully.`);
      this.securityService.fetchHolidays().subscribe();
    });
  }





  handleClose(): void {
    this.showCreateModal = false;
  }

  // Fonction pour gérer le tri
  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;  // Inverse l'ordre si c'est la même colonne
    } else {
      this.sortColumn = column;  // Change la colonne de tri
      this.sortAscending = true; // Default à ordre croissant
    }

    this.sortHolidays();
  }

  // Fonction pour trier les jours fériés
  private sortHolidays(): void {
    const sortedHolidays = [...this.securityService.holidays$()].sort((a, b) => {
      const valA = a[this.sortColumn as keyof Holiday];
      const valB = b[this.sortColumn as keyof Holiday];

      if (valA! < valB!) {
        return this.sortAscending ? -1 : 1;
      }
      if (valA! > valB!) {
        return this.sortAscending ? 1 : -1;
      }
      return 0;
    });

    this.securityService.holidays$.set(sortedHolidays);  // Met à jour la liste triée
  }


}
