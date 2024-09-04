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
import {BeautyCareMachine, BeautyCareMachineTranslations} from "../../../care/enum/care-machine.enum";
import {CareZone, CareZoneTranslations} from "../../../care/enum/care-zone.enum";
import {CareCategory, CareCategoryTranslations} from "../../../care/enum/care-category.enum";
import {SecurityService} from "@feature-security";
import {AddCarePayload} from "../../../security/data/payload/care/add-care.payload";
import {DeleteCarePayload} from "../../../security/data/payload/care/delete-care.payload";

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

  protected showCreateModal: boolean = false;
  protected showEditModal: boolean = false;
  protected readonly title: string =   "admin-feature.admin.manage-care.title";
  protected readonly add_care: string = "admin-feature.admin.manage-care.add";
  protected readonly modal_add_title: string = "admin-feature.admin.modal.add.title";
  protected readonly modal_edit_title: string ="admin-feature.admin.modal.edit.title";
  protected readonly col_name : string = "admin-feature.admin.manage-care.column.name";
  protected readonly col_zone : string = "admin-feature.admin.manage-care.column.zone";
  protected readonly col_category : string = "admin-feature.admin.manage-care.column.category";
  protected readonly col_machine : string = "admin-feature.admin.manage-care.column.machine";
  protected readonly col_price : string = "admin-feature.admin.manage-care.column.price";
  protected readonly col_duration : string = "admin-feature.admin.manage-care.column.duration";
  protected readonly col_time_between : string = "admin-feature.admin.manage-care.column.time_between";
  protected readonly col_edit : string = "admin-feature.admin.manage-care.column.edit";
  protected readonly col_delete : string = "admin-feature.admin.manage-care.column.delete";
  protected readonly col_sessions: string = "admin-feature.admin.manage-care.column.sessions";



  private readonly translateService: TranslateService = inject(TranslateService);
  protected readonly securityService: SecurityService = inject(SecurityService);
  public formError$: WritableSignal<FormError[]> = signal([]);
  private currentCareId: string | null = null;

  private editCarePayload: EditCarePayload = {
    care_id: '',
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
        label: this.getTranslatedMachine(machine)
      })),
      placeholder: 'care.form.select_machine'
    },
    {
      label: 'care.form.zone',
      formControl: this.formGroup.get('zone') as FormControl,
      inputType: 'select',
      options: Object.values(CareZone).map(zone => ({
        value: zone,
        label: this.getTranslatedZone(zone)
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
        value: category, // valeur brute
        label: this.getTranslatedCategory(category) // label traduit
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
    this.securityService.fetchCares().subscribe();
    handleFormError(this.formGroup, this.formError$);
  }

  public error(): FormError[] {
    return this.formError$();
  }

  onSubmitCreateCare() {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;
      const createdCare: AddCarePayload = {
        name: formValue.name ?? '',
        beauty_care_machine: formValue.beauty_care_machine ?? '',
        category: formValue.category ?? '',
        zone: formValue.zone ?? '',
        sessions: formValue.sessions ?? 0,
        price: formValue.price ?? 0,
        duration: formValue.duration ?? '',
        time_between: formValue.time_between ?? ''
      };

      this.securityService.addCare(createdCare).subscribe()
      console.log('Updated Care Data:', createdCare);

      this.showCreateModal = false;
    } else {
      console.error('Form is invalid');
    }
  }

  onSubmitEditCare() {
    if (this.formGroup.valid && this.currentCareId) { // Assurez-vous que currentCareId est défini
      const formValue = this.formGroup.value;
      const updatedCare: EditCarePayload = {
        care_id: this.currentCareId, // Utilise l'ID du soin en cours de modification
        name: formValue.name ?? '',
        beauty_care_machine: formValue.beauty_care_machine ?? '',
        category: formValue.category ?? '',
        zone: formValue.zone ?? '',
        sessions: formValue.sessions ?? 0,
        price: formValue.price ?? 0,
        duration: formValue.duration ?? '',
        time_between: formValue.time_between ?? ''
      };

      this.securityService.editCare(updatedCare).subscribe(response => {
        console.log('Updated Care Data:', updatedCare);
        this.handleCareUpdate(updatedCare); // Mets à jour la liste des soins
      });

      this.showEditModal = false;
    } else {
      console.error('Form is invalid or care_id is missing');
    }
  }

  handleClose(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
  }

  loadCareDetails(care: Care): void {
    this.currentCareId = care.care_id; // Stocke l'ID du soin en cours de modification

    this.formGroup.reset({
      name: care.name,
      sessions: care.sessions,
      beauty_care_machine: care.beauty_care_machine,
      zone: care.zone,
      duration: care.duration,
      category: care.category,
      price: care.price,
      time_between: care.time_between
    });
    this.showEditModal = true;
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

    this.securityService.cares$.set(sortedCares);
  }

  deleteCare(care: Care): void {
    const payload: DeleteCarePayload = { care_id: care.care_id }; // Assurez-vous d'utiliser `care_id` et non `care.id`
    this.securityService.deleteCare(payload).subscribe(
      () => {
        console.log(`Care with ID ${care.care_id} deleted successfully.`);
        // Mettez à jour la liste des soins après suppression
        this.securityService.fetchCares().subscribe();
      },
      error => {
        console.error('Error deleting care:', error);
      }
    );
  }


  handleCareUpdate(updatedCare: Care): void {
    const cares: Care[] = [...this.securityService.cares$()];
    const index: number = cares.findIndex(c => c.care_id === updatedCare.care_id);
    if (index > -1) {
      cares[index] = updatedCare;
      this.securityService.cares$.set(cares);
    }
    this.showEditModal = false;
  }

  getTranslatedCategory(category: CareCategory): string {
    return this.translateService.instant(CareCategoryTranslations[category]);
  }
  getTranslatedZone(zone: CareZone): string {
    return this.translateService.instant(CareZoneTranslations[zone]);
  }
  getTranslatedMachine(machine: BeautyCareMachine): string {
    return this.translateService.instant(BeautyCareMachineTranslations[machine]);
  }

}
