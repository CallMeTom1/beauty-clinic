import { Component, inject, OnInit } from '@angular/core';
import { SecurityService } from "@feature-security";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CustomEuroPipe, FormcontrolSimpleConfig } from "@shared-ui";
import { NgClass } from "@angular/common";
import {
  FloatingLabelInputTestComponent
} from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";

@Component({
  selector: 'app-manage-shipping-fee',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatingLabelInputTestComponent,
    TranslateModule,
    ModalComponent,
    CustomEuroPipe,
    NgClass
  ],
  templateUrl: './manage-shipping-fee.component.html',
  styleUrls: ['./manage-shipping-fee.component.scss']
})
export class ManageShippingFeeComponent implements OnInit {
  protected securityService: SecurityService = inject(SecurityService);
  protected translateService: TranslateService = inject(TranslateService);

  public showEditModal = false;

  public shippingFeeFormGroup: FormGroup = new FormGroup({
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
    ]),
    amount: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
    ]),
    freeShippingThreshold: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
    ])
  });

  public shippingFeeFormControlConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.shipping_fee.description.label'),
      formControl: this.shippingFeeFormGroup.get('description') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.shipping_fee.description.placeholder')
    },
    {
      label: this.translateService.instant('form.shipping_fee.amount.label'),
      formControl: this.shippingFeeFormGroup.get('amount') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.shipping_fee.amount.placeholder')
    },
    {
      label: this.translateService.instant('form.shipping_fee.free_shipping_threshold.label'),
      formControl: this.shippingFeeFormGroup.get('freeShippingThreshold') as FormControl,
      inputType: 'number',
      placeholder: this.translateService.instant('form.shipping_fee.free_shipping_threshold.placeholder')
    }
  ];

  ngOnInit() {
    this.securityService.fetchShippingFees().subscribe();
  }

  openEditModal(): void {
    const currentFee = this.securityService.shippingFees$();
    this.shippingFeeFormGroup.patchValue({
      description: currentFee.description,
      amount: currentFee.amount,
      freeShippingThreshold: currentFee.freeShippingThreshold
    });
    this.showEditModal = true;
  }

  handleClose(): void {
    this.showEditModal = false;
  }

  onSubmitUpdateShippingFee(): void {
    if (this.shippingFeeFormGroup.valid) {
      const currentFee = this.securityService.shippingFees$();
      const payload = {
        shipping_fee_id: currentFee.shipping_fee_id,
        description: this.shippingFeeFormGroup.get('description')?.value,
        amount: parseFloat(this.shippingFeeFormGroup.get('amount')?.value),
        freeShippingThreshold: parseFloat(this.shippingFeeFormGroup.get('freeShippingThreshold')?.value)
      };

      this.securityService.updateShippingFee(payload).subscribe({
        next: () => {
          this.handleClose();
          this.securityService.fetchShippingFees().subscribe();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour des frais de livraison', err);
        }
      });
    }
  }
}
