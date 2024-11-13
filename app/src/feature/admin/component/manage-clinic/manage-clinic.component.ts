import {Component, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Clinic} from "../../../security/data/model/clinic/clinic.business";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormcontrolSimpleConfig} from "@shared-ui";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {ApiResponse} from "@shared-api";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-manage-clinic',
  standalone: true,
  imports: [
    TranslateModule,
    ModalComponent,
    FloatingLabelInputTestComponent,
    ReactiveFormsModule
  ],
  templateUrl: './manage-clinic.component.html',
  styleUrl: './manage-clinic.component.scss'
})
export class ManageClinicComponent implements OnInit {
  protected securityService: SecurityService = inject(SecurityService);
  protected translateService: TranslateService = inject(TranslateService);
  public showEditModal = false;
  protected modal_edit_title: string = 'modal.edit.clinic.title';
  public clinic: Clinic | null = null;

  // Formulaire pour la mise à jour de la clinique
  public updateClinicFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    phone_number: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required, Validators.email]),
    facebook_url: new FormControl(''),
    instagram_url: new FormControl(''),
    tiktok_url: new FormControl(''),
    linkedin_url: new FormControl(''),
    // Champs de l'adresse
    road: new FormControl(''),
    nb: new FormControl(''),
    cp: new FormControl(''),
    town: new FormControl(''),
    country: new FormControl(''),
    complement: new FormControl('')
  });

  // Formulaire pour gérer le logo
  protected clinicLogoForm: FormGroup = new FormGroup({
    clinicLogo: new FormControl(null, Validators.required)
  });

  public updateClinicFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.clinic.name.label'),
      formControl: this.updateClinicFormGroup.get('name') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.clinic.description.label'),
      formControl: this.updateClinicFormGroup.get('description') as FormControl,
      inputType: 'textarea',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.clinic.phone.label'),
      formControl: this.updateClinicFormGroup.get('phone_number') as FormControl,
      inputType: 'tel',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.clinic.email.label'),
      formControl: this.updateClinicFormGroup.get('mail') as FormControl,
      inputType: 'email',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.clinic.social.facebook.label'),
      formControl: this.updateClinicFormGroup.get('facebook_url') as FormControl,
      inputType: 'url',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.clinic.social.instagram.label'),
      formControl: this.updateClinicFormGroup.get('instagram_url') as FormControl,
      inputType: 'url',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.clinic.social.tiktok.label'),
      formControl: this.updateClinicFormGroup.get('tiktok_url') as FormControl,
      inputType: 'url',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.clinic.social.linkedin.label'),
      formControl: this.updateClinicFormGroup.get('linkedin_url') as FormControl,
      inputType: 'url',
      placeholder: ''
    },
    // Champs de l'adresse
    {
      label: this.translateService.instant('form.clinic.address.road.label'),
      formControl: this.updateClinicFormGroup.get('road') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.clinic.address.number.label'),
      formControl: this.updateClinicFormGroup.get('nb') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.clinic.address.postal.label'),
      formControl: this.updateClinicFormGroup.get('cp') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.clinic.address.town.label'),
      formControl: this.updateClinicFormGroup.get('town') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.clinic.address.country.label'),
      formControl: this.updateClinicFormGroup.get('country') as FormControl,
      inputType: 'text',
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.clinic.address.complement.label'),
      formControl: this.updateClinicFormGroup.get('complement') as FormControl,
      inputType: 'text',
      placeholder: ''
    }
  ];

  ngOnInit() {
    this.securityService.fetchClinic().subscribe({
      next: (response: ApiResponse) => {
        if (response.result && response.data) {
          this.clinic = response.data;
          this.updateFormWithClinicData(response.data);
        }
      }
    });
  }

  private updateFormWithClinicData(clinic: Clinic): void {
    this.updateClinicFormGroup.patchValue({
      name: clinic.name,
      description: clinic.description,
      phone_number: clinic.phone_number,
      mail: clinic.mail,
      facebook_url: clinic.facebook_url || '',
      instagram_url: clinic.instagram_url || '',
      tiktok_url: clinic.tiktok_url || '',
      linkedin_url: clinic.linkedin_url || '',
      // Adresse avec vérification de null
      road: clinic.clinic_address?.road || '',
      nb: clinic.clinic_address?.nb || '',
      cp: clinic.clinic_address?.cp || '',
      town: clinic.clinic_address?.town || '',
      country: clinic.clinic_address?.country || '',
      complement: clinic.clinic_address?.complement || ''
    });
  }

  openEditModal(): void {
    if (this.clinic) {
      this.updateFormWithClinicData(this.clinic);
      this.showEditModal = true;
    }
  }

  handleClose(): void {
    this.showEditModal = false;
  }

  onSubmitUpdateClinic(): void {
    if (this.updateClinicFormGroup.valid && this.clinic) {
      const formValues = this.updateClinicFormGroup.value;

      const payload = {
        clinic_id: this.clinic.clinic_id,
        name: formValues.name,
        description: formValues.description,
        phone_number: formValues.phone_number,
        mail: formValues.mail,
        facebook_url: formValues.facebook_url,
        instagram_url: formValues.instagram_url,
        tiktok_url: formValues.tiktok_url,
        linkedin_url: formValues.linkedin_url,
        address: {
          road: formValues.road,
          nb: formValues.nb,
          cp: formValues.cp,
          town: formValues.town,
          country: formValues.country,
          complement: formValues.complement
        }
      };

      this.securityService.updateClinic(payload).subscribe({
        next: (response : ApiResponse) => {
          if (response.result) {
            this.handleClose();
          }
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la clinique', err);
        }
      });
    }
  }

  async onClinicLogoChange(event: Event): Promise<void> {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];

    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        console.error('Type de fichier non supporté');
        return;
      }

      // Mettre à jour le formulaire
      this.clinicLogoForm.patchValue({
        clinicLogo: file
      });

      // Uploader l'image
      await this.uploadClinicLogo();
    }
  }

  async uploadClinicLogo(): Promise<void> {
    if (this.clinicLogoForm.valid && this.clinic) {
      const formData = new FormData();
      const clinicLogo = this.clinicLogoForm.get('clinicLogo')?.value;

      if (clinicLogo) {
        formData.append('clinicLogo', clinicLogo);
        formData.append('clinicId', this.clinic.clinic_id);

        try {
          await lastValueFrom(this.securityService.uploadClinicLogo(formData));
          // Rafraîchir les données après upload réussi
          await lastValueFrom(this.securityService.fetchClinic());
        } catch (error) {
          console.error('Erreur lors de la mise à jour du logo', error);
        }
      }
    }
  }

  getClinicLogo(): string {
    console.log('logo?', this.clinic?.clinic_logo)
    if (this.clinic?.clinic_logo) {
      return this.clinic.clinic_logo;
    }
    return './assets/default-clinic-logo.png';
  }
}
