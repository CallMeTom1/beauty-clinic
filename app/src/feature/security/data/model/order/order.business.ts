import { Business } from "@shared-core";
import {OrderItem} from "./order-item.business";
import {Payment} from "./payment.business";
import {Address} from "../user/address.business";
import {OrderStatus} from "./order-status.enum";
import {User} from "../user";

export interface Order extends Business {
  idOrder: string;
  totalPrice: number;
  status: OrderStatus;  // Maintenant utilise l'enum au lieu de string
  orderDate: string;
  shippingAddress: Address;
  shippingFee: number;
  trackingNumber: string | null;
  promoCodeId?: string;
  discountAmount?: number;
  totalPriceWithShipping: number;
  user: User;
  items: OrderItem[];
  payments: Payment[];
}
