import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { SecurityService } from "@feature-security";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { Order } from "../../../security/data/model/order/order.business";
import { OrderStatus, OrderStatusLabels } from "../../../security/data/model/order/order-status.enum";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Address } from "../../../security/data/model/user/address.business";
import { FloatingLabelInputTestComponent } from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import { FormcontrolSimpleConfig } from "@shared-ui";
import { TranslateService } from "@ngx-translate/core";
import { AddAddressPayload, ModifyAddressPayload } from "../../../security/data/payload/address/address.payload";

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    ReactiveFormsModule,
    FloatingLabelInputTestComponent
  ],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss'
})
export class OrderConfirmationComponent implements OnInit {
  protected readonly securityService = inject(SecurityService);
  private readonly fb = inject(FormBuilder);
  protected readonly translateService = inject(TranslateService);

  protected currentOrder = signal<Order | null>(null);
  protected showAddressForm = signal(false);
  protected editingAddress: Address | null = null;

  protected readonly shippingAddress = computed(() =>
    this.securityService.account$().addresses.find(addr => addr.isShippingAddress === true)
  );

  protected addressForm: FormGroup = this.fb.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    road: ['', [Validators.required]],
    nb: ['', [Validators.required]],
    cp: ['', [Validators.required]],
    town: ['', [Validators.required]],
    country: ['France', [Validators.required]],
    complement: [''],
    label: [''],
    isDefault: [false]
  });

  protected addressFormConfigs: FormcontrolSimpleConfig[] = [
    {
      label: this.translateService.instant('form.address.firstname.label'),
      formControl: this.addressForm.get('firstname') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.firstname.placeholder')
    },
    {
      label: this.translateService.instant('form.address.lastname.label'),
      formControl: this.addressForm.get('lastname') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.lastname.placeholder')
    },
    {
      label: this.translateService.instant('form.address.road.label'),
      formControl: this.addressForm.get('road') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.road.placeholder')
    },
    {
      label: this.translateService.instant('form.address.nb.label'),
      formControl: this.addressForm.get('nb') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.nb.placeholder')
    },
    {
      label: this.translateService.instant('form.address.cp.label'),
      formControl: this.addressForm.get('cp') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.cp.placeholder')
    },
    {
      label: this.translateService.instant('form.address.town.label'),
      formControl: this.addressForm.get('town') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.town.placeholder')
    },
    {
      label: this.translateService.instant('form.address.country.label'),
      formControl: this.addressForm.get('country') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.country.placeholder')
    },
    {
      label: this.translateService.instant('form.address.complement.label'),
      formControl: this.addressForm.get('complement') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.complement.placeholder')
    },
    {
      label: this.translateService.instant('form.address.label.label'),
      formControl: this.addressForm.get('label') as FormControl,
      inputType: 'text',
      placeholder: this.translateService.instant('form.address.label.placeholder')
    }
  ];

  constructor() {
    effect(() => {
      const order = this.securityService.order$();
      if (order) {
        this.currentOrder.set(order);
      }
    });
  }

  ngOnInit() {
    this.securityService.getLastOrder().subscribe();
  }

  protected formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  }

  protected getOrderStatus(): string {
    const status = this.currentOrder()?.status;
    if (!status) return 'Non défini';
    return OrderStatusLabels[status as OrderStatus] || 'Non défini';
  }

  protected getStatusClass(): string {
    const status = this.currentOrder()?.status as OrderStatus;
    switch(status) {
      case OrderStatus.PENDING_PAYMENT:
      case OrderStatus.PENDING_SHIPPING:
        return 'status-pending';
      case OrderStatus.PAYMENT_FAILED:
      case OrderStatus.CANCELLED:
        return 'status-error';
      case OrderStatus.DELIVERED:
      case OrderStatus.SHIPPED:
        return 'status-success';
      default:
        return 'status-default';
    }
  }

  protected openAddressForm() {
    this.addressForm.reset();
    this.addressForm.patchValue({ country: 'France' });
    this.showAddressForm.set(true);
    this.editingAddress = null;
  }

  protected editAddress(address: Address) {
    this.editingAddress = address;
    this.addressForm.patchValue({
      firstname: address.firstname,
      lastname: address.lastname,
      road: address.road,
      nb: address.nb,
      cp: address.cp,
      town: address.town,
      country: address.country,
      complement: address.complement,
      label: address.label,
      isDefault: address.isDefault === 'true'
    });
    this.showAddressForm.set(true);
  }

  protected onSubmitAddress() {
    if (this.addressForm.valid) {
      const formValues = this.addressForm.value;

      if (this.editingAddress) {
        const modifyPayload: ModifyAddressPayload = {
          addressId: this.editingAddress.address_id!,
          ...formValues,
          isShippingAddress: true,
          isBillingAddress: false
        };

        this.securityService.modifyAddress(modifyPayload).subscribe({
          next: () => {
            this.showAddressForm.set(false);
            this.addressForm.reset();
            this.securityService.me().subscribe();
          },
          error: (error) => console.error('Erreur lors de la modification de l\'adresse', error)
        });
      } else {
        const addPayload: AddAddressPayload = {
          ...formValues,
          isShippingAddress: true,
          isBillingAddress: false
        };

        this.securityService.addAddress(addPayload).subscribe({
          next: () => {
            this.showAddressForm.set(false);
            this.addressForm.reset();
            this.securityService.me().subscribe();
          },
          error: (error) => console.error('Erreur lors de l\'ajout de l\'adresse', error)
        });
      }
    }
  }

  protected closeAddressForm(): void {
    this.showAddressForm.set(false);
    this.addressForm.reset();
    this.editingAddress = null;
  }

  protected formatAddress(address: Address): string {
    if (!address) return '';
    return `${address.road} ${address.nb}, ${address.cp} ${address.town}, ${address.country}`;
  }
}
