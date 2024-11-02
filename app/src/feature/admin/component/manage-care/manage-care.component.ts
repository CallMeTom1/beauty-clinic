import {Component, effect, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CurrencyPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {SecurityService} from "@feature-security";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {
  CustomEuroPipe,
  FormcontrolSimpleConfig,
  LabelWithParamComponent,
  LabelWithParamPipe
} from "@shared-ui";
import {Care} from "../../../security/data/model/care/care.business";
import {FloatingLabelInputTestComponent} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {catchError, EMPTY, lastValueFrom, switchMap, tap} from "rxjs";
import {CreateCarePayload} from "../../../security/data/payload/care/add-care.payload";
import {DeleteCarePayload} from "../../../security/data/payload/care/delete-care.payload";
import {EditCarePayload} from "../../data/edit-care.payload";
import {UpdateCarePayload} from "../../../security/data/payload/care/edit-care.payload";
import {UploadCareImagePayload} from "../../../security/data/payload/care/upload-care-image.payload";
import {BodyZoneSelectorComponent} from "../../../shared/ui/care-body-zone-selector/care-body-zone-selector.component";
import {
  CareSubcategorySelectorComponent
} from "../../../shared/ui/care-sub-category-selector/care-sub-category-selector.component";
import {
  CareCategorySelectorComponent
} from "../../../shared/ui/care-category-selector/care-category-selector.component";
import {CareMachineSelectorComponent} from "../../../shared/ui/care-machine-selector/care-machine-selector.component";

@Component({
  selector: 'app-manage-care',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    CurrencyPipe,
    ModalComponent,
    NgIf,
    LabelWithParamComponent,
    LabelWithParamPipe,
    TranslateModule,
    FloatingLabelInputTestComponent,
    CustomEuroPipe,
    NgClass,
    BodyZoneSelectorComponent,
    CareSubcategorySelectorComponent,
    CareCategorySelectorComponent,
    CareMachineSelectorComponent
  ],
  templateUrl: './manage-care.component.html',
  styleUrl: './manage-care.component.scss'
})
export class ManageCareComponent implements OnInit {
  protected readonly securityService: SecurityService = inject(SecurityService);
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected showEditModal = false;
  protected showCreateModal = false;
  protected showDeleteModal = false;
  protected currentCare: Care | null = null;
  protected readonly Math = Math;
  private currentPromoPercentage: number = 0;
  protected currentPromoCare: Care | null = null;


  protected careImageForm: FormGroup = new FormGroup({
    careImage: new FormControl(null, Validators.required)
  });

  // Formulaire pour créer un soin
  public createCareFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(500)
    ]),
    care_image: new FormControl(null),
    initial_price: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
    ]),
    sessions: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^[0-9]*$')
    ]),
    duration: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^[0-9]*$')
    ]),
    time_between: new FormControl('', [
      Validators.pattern('^[0-9]*$')
    ]),
    is_promo: new FormControl(false),
    promo_percentage: new FormControl('', [
      Validators.min(0),
      Validators.max(100),
      Validators.pattern('^[0-9]*$')
    ]),
    isPublished: new FormControl(false),
    machines: new FormControl([]),
    categories: new FormControl([]),
    subCategories: new FormControl([]),
    bodyZones: new FormControl([])
  });

  // Formulaire pour mettre à jour un soin
  public updateCareFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(500)
    ]),
    care_image: new FormControl(null),
    initial_price: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
    ]),
    sessions: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^[0-9]*$')
    ]),
    duration: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^[0-9]*$')
    ]),
    time_between: new FormControl('', [
      Validators.pattern('^[0-9]*$')
    ]),
    is_promo: new FormControl(false),
    promo_percentage: new FormControl('', [
      Validators.min(0),
      Validators.max(100),
      Validators.pattern('^[0-9]*$')
    ]),
    isPublished: new FormControl(false),
    machines: new FormControl([]),
    categories: new FormControl([]),
    subCategories: new FormControl([]),
    bodyZones: new FormControl([])
  });

  public createCareFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.care.name.label'),
      formControl: this.createCareFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.care.name.placeholder')
    },
    {
      label: this.translateService.instant('form.care.description.label'),
      formControl: this.createCareFormGroup.get('description') as FormControl,
      inputType: 'textarea',
      placeholder: this.translateService.instant('form.care.description.placeholder')
    },
    {
      label: this.translateService.instant('form.care.initial_price.label'),
      formControl: this.createCareFormGroup.get('initial_price') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.care.initial_price.placeholder')
    },
    {
      label: this.translateService.instant('form.care.sessions.label'),
      formControl: this.createCareFormGroup.get('sessions') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.care.sessions.placeholder')
    },
    {
      label: this.translateService.instant('form.care.duration.label'),
      formControl: this.createCareFormGroup.get('duration') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.care.duration.placeholder')
    },
    {
      label: this.translateService.instant('form.care.time_between.label'),
      formControl: this.createCareFormGroup.get('time_between') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.care.time_between.placeholder')
    },
    {
      label: this.translateService.instant('form.care.is_promo.label'),
      formControl: this.createCareFormGroup.get('is_promo') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care.promo_percentage.label'),
      formControl: this.createCareFormGroup.get('promo_percentage') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.care.promo_percentage.placeholder')
    },
    {
      label: this.translateService.instant('form.care.isPublished.label'),
      formControl: this.createCareFormGroup.get('isPublished') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    }
  ];

  public updateCareFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.care.name.label'),
      formControl: this.createCareFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care.description.label'),
      formControl: this.createCareFormGroup.get('description') as FormControl,
      inputType: 'textarea',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care.initial_price.label'),
      formControl: this.createCareFormGroup.get('initial_price') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care.sessions.label'),
      formControl: this.createCareFormGroup.get('sessions') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care.duration.label'),
      formControl: this.createCareFormGroup.get('duration') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care.time_between.label'),
      formControl: this.createCareFormGroup.get('time_between') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care.is_promo.label'),
      formControl: this.createCareFormGroup.get('is_promo') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care.promo_percentage.label'),
      formControl: this.createCareFormGroup.get('promo_percentage') as FormControl,
      inputType: 'number',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.care.isPublished.label'),
      formControl: this.createCareFormGroup.get('isPublished') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    }
  ];

  constructor() {
    effect(() => {
      const cares: Care[] = this.securityService.cares$();
      if (cares.length > 0) {
        this.updateFormWithCareData(cares[0]);
      }
    });

  }

  ngOnInit() {
    this.securityService.fetchCares().subscribe()
  }

  openEditModal(care: Care): void {
    this.currentCare = care;
    this.updateCareFormGroup.patchValue({
      name: care.name,
      description: care.description,
      initial_price: care.initial_price,
      sessions: care.sessions,
      duration: care.duration,
      time_between: care.time_between,
      is_promo: care.is_promo,
      promo_percentage: care.promo_percentage,
      isPublished: care.isPublished,
      machines: care.machines,
      categories: care.categories,
      subCategories: care.subCategories,
      bodyZones: care.bodyZones
    });
    this.currentPromoPercentage = care.promo_percentage || 0;
    this.showEditModal = true;
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  openDeleteModal(care: Care): void {
    this.currentCare = care;
    this.showDeleteModal = true;
  }

  handleClose(): void {
    this.showEditModal = false;
    this.showCreateModal = false;
    this.showDeleteModal = false;
    this.showDeleteModal = false;
  }

  private updateFormWithCareData(care: Care): void {
    this.currentCare = care;
    this.updateCareFormGroup.patchValue({
      name: care.name,
      description: care.description,
      initial_price: care.initial_price,
      sessions: care.sessions,
      duration: care.duration,
      time_between: care.time_between,
      is_promo: care.is_promo,
      promo_percentage: care.promo_percentage,
      isPublished: care.isPublished,
      machines: care.machines,
      categories: care.categories,
      subCategories: care.subCategories,
      bodyZones: care.bodyZones
    });

    this.updateCareFormControlConfigs = [
      {
        label: this.translateService.instant('form.care.name.label'),
        formControl: this.updateCareFormGroup.get('name') as FormControl,
        inputType: 'text',
        placeholder: ''
      },
      {
        label: this.translateService.instant('form.care.description.label'),
        formControl: this.updateCareFormGroup.get('description') as FormControl,
        inputType: 'textarea',
        placeholder: ''
      },
      {
        label: this.translateService.instant('form.care.initial_price.label'),
        formControl: this.updateCareFormGroup.get('initial_price') as FormControl,
        inputType: 'number',
        placeholder: ''
      },
      {
        label: this.translateService.instant('form.care.sessions.label'),
        formControl: this.updateCareFormGroup.get('sessions') as FormControl,
        inputType: 'number',
        placeholder: ''
      },
      {
        label: this.translateService.instant('form.care.duration.label'),
        formControl: this.updateCareFormGroup.get('duration') as FormControl,
        inputType: 'number',
        placeholder: ''
      },
      {
        label: this.translateService.instant('form.care.time_between.label'),
        formControl: this.updateCareFormGroup.get('time_between') as FormControl,
        inputType: 'number',
        placeholder: ''
      },
      {
        label: this.translateService.instant('form.care.is_promo.label'),
        formControl: this.updateCareFormGroup.get('is_promo') as FormControl,
        inputType: 'checkbox',
        placeholder: ''
      },
      {
        label: this.translateService.instant('form.care.promo_percentage.label'),
        formControl: this.updateCareFormGroup.get('promo_percentage') as FormControl,
        inputType: 'number',
        placeholder: ''
      },
      {
        label: this.translateService.instant('form.care.isPublished.label'),
        formControl: this.updateCareFormGroup.get('isPublished') as FormControl,
        inputType: 'checkbox',
        placeholder: ''
      }
    ];
  }

  onSubmitCreateCare(): void {
    if (this.createCareFormGroup.valid) {
      const formValue = this.createCareFormGroup.value;
      const payload: CreateCarePayload = {
        name: formValue.name,
        description: formValue.description,
        initial_price: Number(formValue.initial_price),
        sessions: Number(formValue.sessions),
        duration: Number(formValue.duration),
        time_between: Number(formValue.time_between || 0), // Conversion en number obligatoire
        isPublished: Boolean(formValue.isPublished),
        promo_percentage: formValue.is_promo ? Number(formValue.promo_percentage) : undefined,
        machine_ids: (formValue.machines || []).map((m: any) => m.care_machine_id),
        category_ids: (formValue.categories || []).map((c: any) => c.category_id),
        sub_category_ids: (formValue.subCategories || []).map((sc: any) => sc.sub_category_id),
        body_zone_ids: (formValue.bodyZones || []).map((bz: any) => bz.body_zone_id)
      };

      this.securityService.addCare(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchCares().subscribe();
        },
        error: (err) => console.error('Erreur lors de la création du soin', err)
      });
    }
  }

  onSubmitUpdateCare(): void {
    if (this.updateCareFormGroup.valid && this.currentCare) {
      const formValue = this.updateCareFormGroup.value;
      const payload: UpdateCarePayload = {
        care_id: this.currentCare.care_id,
        name: formValue.name,
        description: formValue.description,
        initial_price: Number(formValue.initial_price),
        sessions: Number(formValue.sessions),
        duration: Number(formValue.duration),
        time_between: formValue.time_between ? Number(formValue.time_between) : undefined,
        isPublished: Boolean(formValue.isPublished),
        is_promo: Boolean(formValue.is_promo),
        promo_percentage: formValue.is_promo ? Number(formValue.promo_percentage) : undefined,
        machine_ids: (formValue.machines || []).map((m: any) => m.care_machine_id),
        category_ids: (formValue.categories || []).map((c: any) => c.category_id),
        sub_category_ids: (formValue.subCategories || []).map((sc: any) => sc.sub_category_id),
        body_zone_ids: (formValue.bodyZones || []).map((bz: any) => bz.body_zone_id)
      };

      this.securityService.editCare(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchCares().subscribe();
        },
        error: (err) => console.error('Erreur lors de la mise à jour du soin', err)
      });
    }
  }

  deleteCare(): void {
    if (this.currentCare) {
      const payload: DeleteCarePayload = { care_id: this.currentCare.care_id };

      this.securityService.deleteCare(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchCares().subscribe();
        },
        error: (err) => console.error('Erreur lors de la suppression du soin', err)
      });
    }
  }

  // Gestion des images
  async onCareImageChange(event: Event, care: Care): Promise<void> {
    const file: File | undefined = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.careImageForm.patchValue({
        careImage: file
      });
      await this.uploadCareImage(care);
    }
  }

  async uploadCareImage(care: Care): Promise<void> {
    if (this.careImageForm.valid) {
      const formData: FormData = new FormData();
      const careImage = this.careImageForm.get('careImage')?.value;

      if (careImage) {
        formData.append('careId', care.care_id);
        formData.append('careImage', careImage)

        try {
          await lastValueFrom(this.securityService.uploadCareImage(formData));
        } catch (error) {
          console.error('Erreur lors du téléchargement de l\'image', error);
        }
      }
    }
  }

  // Gestion des promotions
  onPromoPercentageChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.currentPromoPercentage = parseInt(value, 10) || 0;
  }

  applyPromotion(care: Care): void {
    const payload: UpdateCarePayload = {
      care_id: care.care_id,
      is_promo: true,
      promo_percentage: this.currentPromoPercentage
    };

    this.securityService.editCare(payload).subscribe({
      next: () => {
        this.securityService.fetchCares().subscribe();
      },
      error: (err) => console.error('Erreur lors de l\'application de la promotion', err)
    });
  }

  removePromotion(care: Care): void {
    const payload: UpdateCarePayload = {
      care_id: care.care_id,
      is_promo: false,
      promo_percentage: undefined
    };

    this.securityService.editCare(payload).subscribe({
      next: () => {
        this.securityService.fetchCares().subscribe();
      },
      error: (err) => console.error('Erreur lors de la suppression de la promotion', err)
    });
  }

  // Méthode pour publier/dépublier un soin
  togglePublishCare(care: Care): void {
    const payload: UpdateCarePayload = {
      care_id: care.care_id,
      isPublished: !care.isPublished
    };

    this.securityService.editCare(payload)
      .pipe(
        tap(() => console.log(`Soin ${payload.isPublished ? 'publié' : 'dépublié'} avec succès`)),
        switchMap(() => this.securityService.fetchCares()),
        catchError((error) => {
          console.error(`Erreur lors de la ${payload.isPublished ? 'publication' : 'dépublication'} du soin`, error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  togglePromoPopover(care: Care): void {
    if (this.currentPromoCare?.care_id === care.care_id) {
      this.currentPromoCare = null;
    } else {
      this.currentPromoCare = care;
      this.currentPromoPercentage = care.promo_percentage || 0;
    }
  }


  // Méthodes utilitaires
  formatDuration(minutes: number): string {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h${remainingMinutes}min`
        : `${hours}h`;
    }
    return `${minutes}min`;
  }

  getCareImage(care: Care): string {
    return care.care_image || './assets/default-care.png';
  }

  // Gestion des erreurs de formulaire
  getFormErrorMessage(control: string, formGroup: FormGroup): string {
    const ctrl = formGroup.get(control);
    if (!ctrl) return '';

    if (ctrl.hasError('required')) {
      return this.translateService.instant('form.error.required');
    }
    if (ctrl.hasError('minlength')) {
      return this.translateService.instant('form.error.minlength', {
        min: ctrl.errors?.['minlength'].requiredLength
      });
    }
    if (ctrl.hasError('maxlength')) {
      return this.translateService.instant('form.error.maxlength', {
        max: ctrl.errors?.['maxlength'].requiredLength
      });
    }
    if (ctrl.hasError('min')) {
      return this.translateService.instant('form.error.min', {
        min: ctrl.errors?.['min'].min
      });
    }
    if (ctrl.hasError('pattern')) {
      return this.translateService.instant('form.error.pattern');
    }
    return '';
  }


}
