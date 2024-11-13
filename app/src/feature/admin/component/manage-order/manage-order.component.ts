import { Component, inject, OnInit } from '@angular/core';
import { SecurityService } from "@feature-security";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Order } from "../../../security/data/model/order/order.business";
import { OrderStatus, OrderStatusLabels } from "../../../security/data/model/order/order-status.enum";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ModalComponent } from "../../../shared/ui/modal/modal/modal.component";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { UpdateStatusOrderPayload } from "../../../security/data/payload/order/update-status-order.payload";
import { UpdateOrderTrackingNumberPayload } from "../../../security/data/payload/order/update-order-tracking-number.payload";
import { tap } from 'rxjs/operators';
import { FloatingLabelInputTestComponent } from "../../../shared/ui/form/component/floating-label-input-test/floating-label-input-test.component";
import { FormcontrolSimpleConfig } from "@shared-ui";

@Component({
  selector: 'app-manage-order',
  standalone: true,
  imports: [
    TranslateModule,
    ModalComponent,
    ReactiveFormsModule,
    NgClass,
    NgForOf,
    NgIf,
    FloatingLabelInputTestComponent
  ],
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss'
})
export class ManageOrderComponent implements OnInit {
  protected readonly securityService = inject(SecurityService);
  protected readonly translateService = inject(TranslateService);
  protected orders: Order[] = [];
  protected readonly orderStatuses = Object.values(OrderStatus);
  protected readonly statusLabels = OrderStatusLabels;

  // États des modales
  protected showStatusModal = false;
  protected showTrackingModal = false;
  protected currentOrder: Order | null = null;

  // Formulaires
  protected statusForm = new FormGroup({
    status: new FormControl<OrderStatus | null>(null, [Validators.required])
  });

  protected trackingForm = new FormGroup({
    trackingNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(50)
    ])
  });

  // Configuration du formulaire de numéro de suivi
  protected trackingFormConfig: FormcontrolSimpleConfig = {
    label: this.translateService.instant('form.order.tracking.label'),
    formControl: this.trackingForm.get('trackingNumber') as FormControl,
    inputType: 'text',
    placeholder: this.translateService.instant('form.order.tracking.placeholder')
  };

  ngOnInit() {
    this.loadOrders();
  }

  protected loadOrders() {
    this.securityService.fetchOrders().subscribe({
      complete: () => {
        this.orders = this.securityService.orders$();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des commandes', error);
      }
    });
  }

  protected formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  protected formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  }

  protected formatAddress(address: any): string {
    if (!address) return '-';
    return `${address.nb} ${address.road}, ${address.cp} ${address.town}, ${address.country}`;
  }

  protected getStatusClass(status: OrderStatus): string {
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
      case OrderStatus.PROCESSING:
        return 'status-processing';
      case OrderStatus.REFUNDED:
        return 'status-refunded';
      default:
        return 'status-default';
    }
  }

  protected openStatusModal(order: Order) {
    this.currentOrder = order;
    this.statusForm.patchValue({
      status: order.status as OrderStatus
    });
    this.showStatusModal = true;
  }

  protected openTrackingModal(order: Order) {
    this.currentOrder = order;
    this.trackingForm.patchValue({
      trackingNumber: order.trackingNumber || ''
    });
    this.showTrackingModal = true;
  }

  protected handleClose() {
    this.showStatusModal = false;
    this.showTrackingModal = false;
    this.currentOrder = null;
    this.statusForm.reset();
    this.trackingForm.reset();
  }

  protected updateStatus() {
    if (this.statusForm.valid && this.currentOrder) {
      const status = this.statusForm.get('status')?.value;
      if (!status) return;

      const payload: UpdateStatusOrderPayload = {
        idOrder: this.currentOrder.idOrder,
        status: status
      };

      this.securityService.updateOrderStatus(payload)
        .pipe(
          tap(() => {
            this.handleClose();
            this.loadOrders();
          })
        )
        .subscribe({
          error: (error) => {
            console.error('Erreur lors de la mise à jour du statut', error);
          }
        });
    }
  }

  protected updateTrackingNumber() {
    if (this.trackingForm.valid && this.currentOrder) {
      const trackingNumber = this.trackingForm.get('trackingNumber')?.value;
      if (!trackingNumber) return;

      const payload: UpdateOrderTrackingNumberPayload = {
        idOrder: this.currentOrder.idOrder,
        trackingNumber: trackingNumber
      };

      this.securityService.updateOrderTrackingNumber(payload)
        .pipe(
          tap(() => {
            this.handleClose();
            this.loadOrders();
          })
        )
        .subscribe({
          error: (error) => {
            console.error('Erreur lors de la mise à jour du numéro de suivi', error);
          }
        });
    }
  }

  protected readonly OrderStatus = OrderStatus;
}
