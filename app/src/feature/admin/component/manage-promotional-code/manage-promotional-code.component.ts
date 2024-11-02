import { Component, inject, OnInit } from '@angular/core';
import { SecurityService } from "@feature-security";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CustomEuroPipe, FormcontrolSimpleConfig } from "@shared-ui";
import { NgClass, DatePipe } from "@angular/common";
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {PromotionalCode} from "../../../security/data/model/promotional-code/promotional-code.business";

@Component({
  selector: 'app-manage-promotional-code',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingLabelInputTestComponent,
    TranslateModule,
    ModalComponent,
    CustomEuroPipe,
    NgClass,
    DatePipe
  ],
  templateUrl: './manage-promotional-code.component.html',
  styleUrls: ['./manage-promotional-code.component.scss']
})
export class ManagePromotionalCodeComponent implements OnInit {
  protected securityService: SecurityService = inject(SecurityService);
  protected translateService: TranslateService = inject(TranslateService);

  public showEditModal = false;
  public showCreateModal = false;
  public showDeleteModal = false;
  public currentPromoCode: PromotionalCode | null = null;

  public promoCodeForm: FormGroup = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern('^[A-Z0-9_-]*$')
    ]),
    percentage: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
      Validators.pattern('^[0-9]*$')
    ]),
    maxUses: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^[0-9]*$')
    ]),
    validFrom: new FormControl('', [Validators.required]),
    validTo: new FormControl('', [Validators.required]),
    isActive: new FormControl(false, [Validators.required]),
  });

  public get modalTitle(): string {
    return this.showCreateModal ? 'modal.create.promo_code.title' : 'modal.edit.promo_code.title';
  }

  public get submitButtonLabel(): string {
    return this.showCreateModal ? 'form.create.label' : 'form.update.label';
  }

  public formControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.promo_code.code.label'),
      formControl: this.promoCodeForm.get('code') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.promo_code.code.placeholder')
    },
    {
      label: this.translateService.instant('form.promo_code.percentage.label'),
      formControl: this.promoCodeForm.get('percentage') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.promo_code.percentage.placeholder')
    },
    {
      label: this.translateService.instant('form.promo_code.max_uses.label'),
      formControl: this.promoCodeForm.get('maxUses') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.promo_code.max_uses.placeholder')
    },
    {
      label: this.translateService.instant('form.promo_code.valid_from.label'),
      formControl: this.promoCodeForm.get('validFrom') as FormControl,
      inputType: 'datetime-local', // Changé de 'date' à 'datetime-local'
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.promo_code.valid_to.label'),
      formControl: this.promoCodeForm.get('validTo') as FormControl,
      inputType: 'datetime-local', // Changé de 'date' à 'datetime-local'
      placeholder: ''
    },
    {
      label: this.translateService.instant('form.promo_code.is_active.label'),
      formControl: this.promoCodeForm.get('isActive') as FormControl,
      inputType: 'checkbox',
      placeholder: ''
    }
  ];

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    // Format YYYY-MM-DDThh:mm
    return d.getFullYear().toString().padStart(4, '0') + '-' +
      (d.getMonth() + 1).toString().padStart(2, '0') + '-' +
      d.getDate().toString().padStart(2, '0') + 'T' +
      d.getHours().toString().padStart(2, '0') + ':' +
      d.getMinutes().toString().padStart(2, '0');
  }

  ngOnInit() {
    this.securityService.fetchPromoCodes().subscribe();
  }

  openCreateModal(): void {
    this.promoCodeForm.reset({
      code: '',
      percentage: '', // Conversion explicite en nombre
      maxUses: '', // Conversion explicite en nombre
      validFrom: '',
      validTo: '',
      isActive: false
    });
    this.showCreateModal = true;
  }

  openEditModal(promo: PromotionalCode): void {
    this.currentPromoCode = promo;
    this.promoCodeForm.patchValue({
      code: promo.code,
      percentage: promo.percentage,
      maxUses: promo.maxUses,
      validFrom: this.formatDateForInput(promo.validFrom),
      validTo: this.formatDateForInput(promo.validTo),
      isActive: promo.isActive  // Ajout de isActive
    });
    this.showEditModal = true;
  }

  openDeleteModal(promo: PromotionalCode): void {
    this.currentPromoCode = promo;
    this.showDeleteModal = true;
  }

  handleClose(): void {
    this.showEditModal = false;
    this.showCreateModal = false;
    this.showDeleteModal = false;
    this.currentPromoCode = null;
    this.promoCodeForm.reset();
  }



  toggleStatus(promo: PromotionalCode): void {
    const updatePayload = {
      promo_code_id: promo.promo_code_id,
      isActive: !promo.isActive
    };
    console.log('updatepayload', updatePayload)

    this.securityService.updatePromoCode(updatePayload).subscribe({
      next: () => {
        this.securityService.fetchPromoCodes().subscribe();
      },
      error: (err) => {
        console.error('Erreur lors du changement de statut:', err);
      }
    });
  }


  deletePromoCode(): void {
    if (this.currentPromoCode) {
      const payload = {
        promo_code_id: this.currentPromoCode.promo_code_id
      };

      this.securityService.deletePromoCode(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchPromoCodes().subscribe();
        }
      });
    }
  }

  onSubmitForm(): void {
    if (this.promoCodeForm.valid) {
      const formValue = this.promoCodeForm.value;

      const basePayload = {
        code: formValue.code,
        percentage: Number(formValue.percentage), // Conversion explicite en nombre
        maxUses: Number(formValue.maxUses), // Conversion explicite en nombre
        validFrom: formValue.validFrom,
        validTo: formValue.validTo,
        isActive: formValue.isActive
      };

      if (this.showCreateModal) {
        // Payload pour la création
        this.securityService.createPromoCode(basePayload).subscribe({
          next: () => {
            this.handleClose();
            this.securityService.fetchPromoCodes().subscribe();
          }
        });
      } else {
        // Payload pour la mise à jour avec ID obligatoire
        const updatePayload = {
          promo_code_id: this.currentPromoCode!.promo_code_id,
          ...basePayload
        };

        this.securityService.updatePromoCode(updatePayload).subscribe({
          next: () => {
            this.handleClose();
            this.securityService.fetchPromoCodes().subscribe();
          }
        });
      }
    }
  }

  protected readonly Math = Math;
}
