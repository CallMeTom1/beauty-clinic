import {Component, computed, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {OrderStatus, OrderStatusLabels} from "../../../security/data/model/order/order-status.enum";
import {RouterLink} from "@angular/router";
import {DatePipe, NgClass} from "@angular/common";
import {Order} from "../../../security/data/model/order/order.business";

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    DatePipe
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {
  protected securityService = inject(SecurityService);
  protected readonly OrderStatus = OrderStatus;
  protected readonly statusLabels = OrderStatusLabels;

  ngOnInit() {
    if (this.securityService.account$().idUser) {
      this.securityService.fetchOrders().subscribe();
    }
  }

  getStatusClass(status: OrderStatus): string {
    const statusClasses: Record<OrderStatus, string> = {
      [OrderStatus.PENDING_PAYMENT]: 'status-pending',
      [OrderStatus.PAYMENT_FAILED]: 'status-failed',
      [OrderStatus.PENDING_SHIPPING]: 'status-pending',
      [OrderStatus.PROCESSING]: 'status-processing',
      [OrderStatus.SHIPPED]: 'status-shipped',
      [OrderStatus.DELIVERED]: 'status-delivered',
      [OrderStatus.CANCELLED]: 'status-cancelled',
      [OrderStatus.REFUNDED]: 'status-refunded'
    };
    return statusClasses[status] || '';
  }

  formatAddress(address: Order['shippingAddress']): string {
    if (!address) return '';
    return `${address.road} ${address.nb}, ${address.cp} ${address.town}, ${address.country}`;
  }

}
