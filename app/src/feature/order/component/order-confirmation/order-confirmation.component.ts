import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { SecurityService } from "@feature-security";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { Product } from "../../../security/data/model/product/product.business";
import { Order } from "../../../security/data/model/order/order.business"; // Correction de l'import
import { OrderStatus, OrderStatusLabels } from "../../../security/data/model/order/order-status.enum";
import {ApiResponse} from "@shared-api";

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss'
})
export class OrderConfirmationComponent implements OnInit {
  protected readonly securityService: SecurityService = inject(SecurityService);
  protected readonly products$: Signal<Product[]> = this.securityService.Products$;
  protected order?: Order;

  ngOnInit() {
    this.securityService.getLastOrder().subscribe(
      (response: ApiResponse) => {
        if (response.data) {
          this.order = response.data as Order;
        }
      }
    );
  }

  protected formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  }

  protected getOrderStatus(): string {
    const status = this.order?.status;
    if (!status) return 'Non défini';

    return OrderStatusLabels[status as OrderStatus] || 'Non défini';
  }

  // Méthode utilitaire pour vérifier le statut
  protected isOrderStatus(status: OrderStatus): boolean {
    return this.order?.status === status;
  }

  // Méthode pour obtenir la classe CSS en fonction du statut
  protected getStatusClass(): string {
    const status = this.order?.status as OrderStatus;
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
}
