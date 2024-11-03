import {Component, computed, inject, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {OrderStatus, OrderStatusLabels} from "../../../security/data/model/order/order-status.enum";
import {Order} from "../../../security/data/model/order/order.business";
import {RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss'
})
export class TrackOrderComponent implements OnInit {
  protected securityService = inject(SecurityService);
  protected readonly OrderStatus = OrderStatus;
  protected readonly statusLabels = OrderStatusLabels;

  protected readonly shippedOrders = computed(() =>
    this.securityService.orders$().filter(order =>
      order.status === OrderStatus.SHIPPED && order.trackingNumber
    )
  );

  ngOnInit() {
    if (this.securityService.account$().idUser) {
      this.securityService.fetchOrders().subscribe();
    }
  }

  formatAddress(address: Order['shippingAddress']): string {
    if (!address) return '';
    return `${address.road} ${address.nb}, ${address.cp} ${address.town}, ${address.country}`;
  }

  getStatusClass(status: OrderStatus): string {
    return 'status-shipped';
  }
}
