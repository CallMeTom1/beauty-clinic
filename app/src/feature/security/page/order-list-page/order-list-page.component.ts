import {Component, OnInit, Signal} from '@angular/core';
import {Order} from "../../data/model/order/order.business";
import {SecurityService} from "@feature-security";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {ModalComponent} from "../../../shared/ui/modal/modal/modal.component";
import {AddressFormComponent} from "../../../shared/ui/form/component/address-form/address-form.component";
import {UpdateShippingAddressPayload} from "../../data/payload/order/update-shipping-address.payload";

@Component({
  selector: 'app-order-list-page',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    ModalComponent,
    AddressFormComponent
  ],
  templateUrl: './order-list-page.component.html',
  styleUrl: './order-list-page.component.scss'
})
export class OrderListPageComponent implements OnInit {
  orders: Signal<Order[]> = this.securityService.orders$;
  displayShippingAddressModal = false;
  selectedOrderId: string | null = null;

  constructor(private securityService: SecurityService) {}

  ngOnInit() {
    this.securityService.fetchOrders().subscribe(() => {
      console.log('Orders in component:', this.orders());
      this.orders()?.forEach((order, index) => {
        console.log(`Order ${index + 1}:`, {
          idOrder: order.idOrder,
          totalPrice: order.totalPrice,
          status: order.status,
          shippingAddress: order.shippingAddress
        });
      });
    });
  }


  changeShippingAddress(orderId: string) {
    this.selectedOrderId = orderId;
    this.displayShippingAddressModal = true;
  }

  closeShippingAddressModal() {
    this.displayShippingAddressModal = false;
    this.selectedOrderId = null;
  }

  handleAddressSubmission(event: any) {

    if (this.selectedOrderId && event?.address) {
      const addressData = event.address.address; // Accéder à l'objet address imbriqué

      if (!addressData) {
        return;
      }

      const payload: UpdateShippingAddressPayload = {
        idOrder: this.selectedOrderId,
        road: addressData.road || '',
        nb: addressData.nb || '',
        cp: addressData.cp || '',
        town: addressData.town || '',
        country: addressData.country || '',
        complement: addressData.complement
      };

      // Définir un type d'index pour UpdateShippingAddressPayload
      type ShippingAddressKey = keyof Omit<UpdateShippingAddressPayload, 'idOrder' | 'complement'>;

      const requiredFields: ShippingAddressKey[] = ['road', 'nb', 'cp', 'town', 'country'];

      const missingFields = requiredFields.filter((field: ShippingAddressKey) => !payload[field]);

      if (missingFields.length > 0) {
        return;
      }


      this.securityService.updateShippingAddress(payload).subscribe({
        next: (response) => {
          this.closeShippingAddressModal();
          this.refreshOrders();
        },
        error: (error) => {
        }
      });
    } else {
      console.error('Données insuffisantes pour mettre à jour l\'adresse');
    }
  }

  private refreshOrders() {
    this.securityService.fetchOrders().subscribe({
      next: () => console.log('Commandes rafraîchies'),
      error: (error) => console.error('Erreur lors du rafraîchissement des commandes', error)
    });
  }
}
