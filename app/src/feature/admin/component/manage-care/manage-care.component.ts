import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CurrencyPipe, NgForOf, NgIf } from "@angular/common";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Care } from "../../../care/data/model/care.business";
import { ModalComponent } from "../../../shared/ui/modal/modal/modal.component";
import { FormComponent } from "../../../shared/ui/form/component/form/form.component";
import { CareForm } from "../../../care/care-form.interface";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import { FormcontrolSimpleConfig, FormError, handleFormError, LabelWithParamComponent, LabelWithParamPipe } from "@shared-ui";
import { EditCarePayload } from "../../data/edit-care.payload";
import {BeautyCareMachine} from "../../../care/data/care-machine.enum";
import {CareZone} from "../../../care/data/care-zone.enum";
import {CareCategory} from "../../../care/data/care-category.enum";
import {SecurityService} from "@feature-security";

@Component({
  selector: 'app-manage-care',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    CurrencyPipe,
    ModalComponent,
    NgIf,
    FormComponent,
    LabelWithParamComponent,
    LabelWithParamPipe,
    TranslateModule,
  ],
  templateUrl: './manage-care.component.html',
  styleUrls: ['./manage-care.component.scss']
})
export class ManageCareComponent {

  showCreateModal: boolean = false;
  showEditModal: boolean = false;

  private readonly translateService: TranslateService = inject(TranslateService);
  protected readonly securityService: SecurityService = inject(SecurityService);
  public formError$: WritableSignal<FormError[]> = signal([]);
  private editCarePayload: EditCarePayload = {
    name: '',
    duration: '',
    sessions: 0,
    beauty_care_machine: '',
    price: 0,
    zone: '',
    category: '',
    time_between: ''
  };

  public formGroup: FormGroup<CareForm> = new FormGroup<CareForm>({
    name: new FormControl(this.editCarePayload.name, [Validators.required, Validators.minLength(10), Validators.maxLength(25)]),
    sessions: new FormControl(this.editCarePayload.sessions, [Validators.required, Validators.min(1)]),
    beauty_care_machine: new FormControl(this.editCarePayload.beauty_care_machine as BeautyCareMachine, [Validators.required]),
    zone: new FormControl(this.editCarePayload.zone as CareZone, [Validators.required]),
    duration: new FormControl(this.editCarePayload.duration, [Validators.required, Validators.minLength(10), Validators.maxLength(25)]),
    category: new FormControl(this.editCarePayload.category as CareCategory, [Validators.required]),
    price: new FormControl(this.editCarePayload.price, [Validators.required, Validators.min(0)]),
    time_between: new FormControl(this.editCarePayload.time_between, [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
  });


  public formControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: 'care.form.name',
      formControl: this.formGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: 'care.form.enter_name'
    },
    {
      label: 'care.form.sessions',
      formControl: this.formGroup.get('sessions') as FormControl,
      inputType: 'number',
      placeholder: 'care.form.enter_sessions'
    },
    {
      label: 'care.form.machine',
      formControl: this.formGroup.get('beauty_care_machine') as FormControl,
      inputType: 'select',
      options: Object.values(BeautyCareMachine).map(machine => ({
        value: machine,
        label: `care.form.machines.${machine}`
      })),
      placeholder: 'care.form.select_machine'
    },
    {
      label: 'care.form.zone',
      formControl: this.formGroup.get('zone') as FormControl,
      inputType: 'select',
      options: Object.values(CareZone).map(zone => ({
        value: zone,
        label: `care.form.zones.${zone}`
      })),
      placeholder: 'care.form.select_zone'
    },
    {
      label: 'care.form.duration',
      formControl: this.formGroup.get('duration') as FormControl,
      inputType: 'text',
      placeholder: 'care.form.enter_duration'
    },
    {
      label: 'care.form.category',
      formControl: this.formGroup.get('category') as FormControl,
      inputType: 'select',
      options: Object.values(CareCategory).map(category => ({
        value: category,
        label: `care.form.categories.${category}`
      })),
      placeholder: 'care.form.select_category'
    },
    {
      label: 'care.form.price',
      formControl: this.formGroup.get('price') as FormControl,
      inputType: 'number',
      placeholder: 'care.form.enter_price'
    },
    {
      label: 'care.form.time_between',
      formControl: this.formGroup.get('time_between') as FormControl,
      inputType: 'text',
      placeholder: 'care.form.enter_time_between'
    }
  ];



  constructor() {
    this.securityService.fetchCares();
    handleFormError(this.formGroup, this.formError$);
  }

  public error(): FormError[] {
    return this.formError$();
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;

      // Map form values to EditCarePayload and handle null values
      const updatedCare: EditCarePayload = {
        name: formValue.name ?? '', // Use empty string if null or undefined
        beauty_care_machine: formValue.beauty_care_machine ?? '',
        category: formValue.category ?? '',
        zone: formValue.zone ?? '',
        sessions: formValue.sessions ?? 0, // Use 0 if null or undefined
        price: formValue.price ?? 0,
        duration: formValue.duration ?? '',
        time_between: formValue.time_between ?? ''
      };

      console.log('Updated Care Data:', updatedCare);
      // Here you would typically send the updatedCare to your backend API
      this.showCreateModal = false;
    } else {
      console.error('Form is invalid');
    }
  }

  handleClose(): void {
    this.showCreateModal = false;
  }

  loadCareDetails(care: Care): void {
    this.formGroup.reset({  // Reset and fill the form with existing care details
      name: care.name,
      sessions: care.sessions,
      beauty_care_machine: care.beauty_care_machine,
      zone: care.zone,
      duration: care.duration,
      category: care.category,
      price: care.price,
      time_between: care.time_between
    });
    this.showEditModal = true;  // Open the modal after loading the details
  }



  sortColumn: string = '';
  sortAscending: boolean = true;

  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = true;
      this.sortColumn = column;
    }
    this.sortCares();
  }

  private sortCares(): void {
    const sortedCares = [...this.securityService.cares$()].sort((a, b) => {
      const valA = a[this.sortColumn as keyof Care];
      const valB = b[this.sortColumn as keyof Care];

      if (valA! < valB!) {
        return this.sortAscending ? -1 : 1;
      }
      if (valA! > valB!) {
        return this.sortAscending ? 1 : -1;
      }
      return 0;
    });

    // Update the cares$ signal with the newly sorted array
    this.securityService.cares$.set(sortedCares);
  }

  deleteCare(care: Care): void {
    const updatedCares = this.securityService.cares$().filter(c => c.care_id !== care.care_id);
    this.securityService.cares$.set(updatedCares);
  }


  handleCareUpdate(updatedCare: Care): void {
    const cares = [...this.securityService.cares$()];
    const index = cares.findIndex(c => c.care_id === updatedCare.care_id);
    if (index > -1) {
      cares[index] = updatedCare;
      this.securityService.cares$.set(cares); // Update the entire array
    }
    this.showEditModal = false;
  }

}
