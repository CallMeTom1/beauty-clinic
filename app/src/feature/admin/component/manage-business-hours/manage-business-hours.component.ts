import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {SecurityService} from "@feature-security";
import {
  FormcontrolSimpleConfig,
  FormError,
  handleFormError,
  LabelWithParamComponent,
  LabelWithParamPipe
} from "@shared-ui";
import {EditBusinessHoursPayload} from "../../data/edit-business-hours.payload";
import {DayOfWeekEnum} from "../../../business-hours/day-of-week.enum";
import {BusinessHoursForm} from "../../../business-hours/business-hours.form";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {BusinessHours} from "../../../business-hours/data/model/business-hours.business";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {BusinessStatus, BusinessStatusTranslations} from "./business-status.enum";
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {NgClass} from "@angular/common";


@Component({
  selector: 'app-manage-business-hours',
  standalone: true,
  imports: [
    TranslateModule,
    ModalComponent,
    LabelWithParamComponent,
    LabelWithParamPipe,
    ReactiveFormsModule,
    FloatingLabelInputTestComponent,
    NgClass
  ],
  templateUrl: './manage-business-hours.component.html',
  styleUrl: './manage-business-hours.component.scss'
})
export class ManageBusinessHoursComponent implements OnInit{

  protected securityService: SecurityService = inject(SecurityService);
  private readonly translateService: TranslateService = inject(TranslateService);

  protected showEditModal: boolean = false;
  public formError$: WritableSignal<FormError[]> = signal([]);
  private currentDayOfWeek: DayOfWeekEnum | null = null;
  protected readonly col_actions: string = "admin-feature.admin.manage-business-hours.col_actions";

  protected readonly title: string =   "admin-feature.admin.manage-business-hours.title";
  protected readonly col_day: string =   "admin-feature.admin.manage-business-hours.col_day";
  protected readonly col_opening_time: string =   "admin-feature.admin.manage-business-hours.col_opening_time";
  protected readonly col_closing_time: string =   "admin-feature.admin.manage-business-hours.col_closing_time";
  protected readonly col_is_open: string =   "admin-feature.admin.manage-business-hours.col_is_open";
  protected readonly col_edit: string =   "admin-feature.admin.manage-business-hours.col_edit";
  protected readonly col_open: string =   "admin-feature.admin.manage-business-hours.col_open";
  protected readonly col_close: string =   "admin-feature.admin.manage-business-hours.col_close";
  protected readonly btn_open: string =   "admin-feature.admin.manage-business-hours.btn_open";
  protected readonly btn_close: string =   "admin-feature.admin.manage-business-hours.btn_close";
  protected readonly modal_edit_title: string =   "admin-feature.admin.manage-business-hours.modal_edit_title";
  protected readonly submit: string =   "admin-feature.admin.manage-business-hours.submit";
  protected readonly open: string = 'admin-feature.admin.manage-business-hours.open';
  protected readonly close: string = 'admin-feature.admin.manage-business-hours.close';

  protected transformDayOfWeek(day: DayOfWeekEnum): string {
    return `business_hours.days.${day.toLowerCase()}`;
  }
  private editBusinessHoursPayload: EditBusinessHoursPayload = {
    opening_time: '',
    closing_time: '',
    is_open: false,
  };

  public formGroup: FormGroup<BusinessHoursForm> = new FormGroup<BusinessHoursForm>({
    opening_time: new FormControl(this.editBusinessHoursPayload.opening_time, [Validators.required]),
    closing_time: new FormControl(this.editBusinessHoursPayload.closing_time, [Validators.required]),
    is_open: new FormControl('Open', [Validators.required]),
  });

  public formControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: "business_hours.form.opening_time",
      formControl: this.formGroup.get('opening_time') as FormControl,
      inputType: 'time',
      placeholder: 'HH:mm',
    },
    {
      label: "business_hours.form.closing_time",
      formControl: this.formGroup.get('closing_time') as FormControl,
      inputType: 'time',
      placeholder: 'HH:mm',
    },
    {
      label: "business_hours.form.is_open",
      formControl: this.formGroup.get('is_open') as FormControl,
      inputType: 'select',
      options: Object.values(BusinessStatus).map(status => ({
        value: status,
        label: this.getTranslatedStatus(status)
      })),
      placeholder: 'business_hours.form.status',
    }
  ].map(item => ({
    ...item,
    label: this.translateService.instant(item.label),
    placeholder: this.translateService.instant(item.placeholder),
    options: item.options ? item.options.map(option => ({
      value: option.value,
      label: this.translateService.instant(option.label)
    })) : []
  }));

  constructor() {
    handleFormError(this.formGroup, this.formError$)
  }

  ngOnInit() {
    this.securityService.fetchBusinessHours().subscribe();
  }

  public error(): FormError[] {
    return this.formError$();
  }

  // Open modal to edit business hours for a specific day
  loadBusinessHoursDetails(businessHours: BusinessHours): void {
    this.currentDayOfWeek = businessHours.day_of_week;
    const isOpenString = businessHours.is_open ? 'Open' : 'Closed';


    // Patch the form with the selected business hour's values
    this.formGroup.patchValue({
      opening_time: businessHours.opening_time,
      closing_time: businessHours.closing_time,
      is_open: isOpenString
    });

    // Show modal
    this.showEditModal = true;
  }


  // Submit the edited business hours
  onSubmitEditBusinessHours(): void {
    if (this.formGroup.valid && this.currentDayOfWeek !== null) {
      const formValue = this.formGroup.value;

      // Format the opening_time and closing_time to remove seconds
      const openingTime = this.formatTimeWithoutSeconds(formValue.opening_time);
      const closingTime = this.formatTimeWithoutSeconds(formValue.closing_time);

      console.log('form value', formValue);
      const isOpen = formValue.is_open === 'Open';  // 'Open' -> true, 'Closed' -> false


      const updatedBusinessHoursPayload: EditBusinessHoursPayload = {
        opening_time: openingTime ?? '',
        closing_time: closingTime ?? '',
        is_open: isOpen
      };
      console.log('current day', this.currentDayOfWeek);
      console.log('payload', updatedBusinessHoursPayload)

      // Call the service to update business hours for the selected day
      this.securityService.updateBusinessHoursByDay(this.currentDayOfWeek, updatedBusinessHoursPayload).subscribe(() => {
        this.refreshBusinessHours();
      });

      this.showEditModal = false; // Close modal after submission
    } else {
      console.error('Form is invalid');
    }
  }

  // Handle opening business hours for a specific day
  onSubmitOpenBusinessHours(dayOfWeek: DayOfWeekEnum): void {
    this.securityService.openBusinessDay(dayOfWeek).subscribe(() => {
      this.refreshBusinessHours();
    });
  }

  // Handle closing business hours for a specific day
  onSubmitCloseBusinessHours(dayOfWeek: DayOfWeekEnum): void {
    this.securityService.closeBusinessDay(dayOfWeek).subscribe(() => {
      this.refreshBusinessHours();
    });
  }

  // Close the edit modal
  handleClose(): void {
    this.showEditModal = false;
  }

  // Refresh the business hours list after an update
  refreshBusinessHours(): void {
    this.securityService.fetchBusinessHours().subscribe();
  }

  getTranslatedStatus(status: BusinessStatus ): string {
    return this.translateService.instant(BusinessStatusTranslations[status]);
  }

  private formatTimeWithoutSeconds(time: string | null | undefined): string {
    if (!time) {
      return '';  // Return an empty string if time is null or undefined
    }

    if (time.length === 8) {  // Check if the time includes seconds (HH:mm:ss)
      return time.substring(0, 5);  // Return only HH:mm
    }

    return time;  // If already in HH:mm format, return as is
  }



}
