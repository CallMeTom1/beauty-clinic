import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
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
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DeleteHolidayPayload} from "../../../security/data/payload/holiday/delete-holiday.payload";
import {Holiday} from "../../../holiday/data/model/holiday.business";
import {DatePipe} from "@angular/common";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {CreateHolidayIntervalPayload} from "../../../security/data/payload/holiday/create-holiday-interval.payload";

interface SortConfig {
  column: 'holiday_date';
  ascending: boolean;
}

@Component({
  selector: 'app-manage-holiday',
  standalone: true,
  imports: [
    TranslateModule,
    DatePipe,
    ModalComponent,
    LabelWithParamPipe,
    LabelWithParamComponent,
    ReactiveFormsModule,
    FloatingLabelInputTestComponent
  ],
  templateUrl: './manage-holiday.component.html',
  styleUrl: './manage-holiday.component.scss'
})
export class ManageHolidayComponent implements OnInit {

  protected readonly securityService: SecurityService = inject(SecurityService);
  private readonly translateService: TranslateService = inject(TranslateService);

  // State
  protected showCreateModal: boolean = false;
  public formError$: WritableSignal<FormError[]> = signal([]);
  protected showIntervalModal: boolean = false;
  protected readonly modal_add_interval_title: string = "admin-feature.admin.holiday.modal.add_interval.title";
  protected readonly add_holiday_interval: string = "admin-feature.admin.manage-holiday.add-interval";

  protected sortConfig: SortConfig = {
    column: 'holiday_date',
    ascending: true
  };

  // Translation keys
  protected readonly title: string = "admin-feature.admin.manage-holiday.title";
  protected readonly add_holiday: string = "admin-feature.admin.manage-holiday.add";
  protected readonly modal_add_title: string = "admin-feature.admin.holiday.modal.add.title";
  protected readonly col_date: string = "admin-feature.admin.manage-holiday.column.date";
  protected readonly col_actions: string = "admin-feature.admin.manage-holiday.column.actions";

  // Form setup
  public formGroup: FormGroup = new FormGroup({
    holiday_date: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
    ])
  });

  public formControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.holiday.date.label'),
      formControl: this.formGroup.get('holiday_date') as FormControl,
      inputType: 'date',
      placeholder: this.translateService.instant('form.holiday.date.placeholder')
    }
  ];

  public intervalFormGroup: FormGroup = new FormGroup({
    start_date: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
    ]),
    end_date: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)
    ])
  });

  public intervalFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.holiday.interval.start_date.label'),
      formControl: this.intervalFormGroup.get('start_date') as FormControl,
      inputType: 'date',
      placeholder: this.translateService.instant('form.holiday.interval.start_date.placeholder')
    },
    {
      label: this.translateService.instant('form.holiday.interval.end_date.label'),
      formControl: this.intervalFormGroup.get('end_date') as FormControl,
      inputType: 'date',
      placeholder: this.translateService.instant('form.holiday.interval.end_date.placeholder')
    }
  ];

  constructor() {
    handleFormError(this.formGroup, this.formError$);
    handleFormError(this.intervalFormGroup, this.formError$);
  }

  onSubmitCreateHolidayInterval(): void {
    if (this.intervalFormGroup.valid) {
      const formValue = this.intervalFormGroup.value;
      const payload: CreateHolidayIntervalPayload = {
        start_date: formValue.start_date,
        end_date: formValue.end_date
      };

      this.securityService.createHolidayInterval(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchHolidays().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la création de l\'intervalle de vacances', err);
        }
      });
    }
  }

  ngOnInit() {
    this.securityService.fetchHolidays().subscribe();
  }

  public error(): FormError[] {
    return this.formError$();
  }

  onSubmitCreateHoliday(): void {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;
      const payload: CreateHolidayPayload = {
        holiday_date: formValue.holiday_date
      };

      this.securityService.createHoliday(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchHolidays().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la création du jour férié', err);
        }
      });
    }
  }

  deleteHoliday(holiday: Holiday): void {
    if (!holiday.holiday_date) return;

    const date = new Date(holiday.holiday_date).toISOString().split('T')[0];
    const payload: DeleteHolidayPayload = { holiday_date: date };

    this.securityService.deleteHoliday(payload).subscribe({
      next: () => {
        this.securityService.fetchHolidays().subscribe();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du jour férié', err);
      }
    });
  }

  handleClose(): void {
    this.showCreateModal = false;
    this.showIntervalModal = false;
    this.formGroup.reset();
    this.intervalFormGroup.reset();
  }

  toggleSort(column: SortConfig['column']): void {
    if (column === this.sortConfig.column) {
      this.sortConfig.ascending = !this.sortConfig.ascending;
    }
    this.sortHolidays();
  }

  private sortHolidays(): void {
    const sortedHolidays = [...this.securityService.holidays$()].sort((a, b) => {
      const dateA = a.holiday_date ? new Date(a.holiday_date).getTime() : 0;
      const dateB = b.holiday_date ? new Date(b.holiday_date).getTime() : 0;
      const modifier = this.sortConfig.ascending ? 1 : -1;

      if (dateA === dateB) return 0;
      return dateA < dateB ? -modifier : modifier;
    });

    this.securityService.holidays$.set(sortedHolidays);
  }


}
