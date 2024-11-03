import { Order } from "../data/model/order/order.business";
import { OrderItem } from "../data/model/order/order-item.business";
import { Payment } from "../data/model/order/payment.business";
import { ProductUtils } from "./product.utils";
import { OrderStatus } from "../data/model/order/order-status.enum";
import { UserUtils } from "@feature-security";

export class OrderUtils {
  public static getEmptyOrder(): Order {
    return {
      idOrder: '',
      totalPrice: 0,
      status: OrderStatus.PENDING_PAYMENT,
      orderDate: new Date().toISOString(),
      shippingAddress: UserUtils.getEmptyAddress(), // Utilisation du getEmptyAddress de UserUtils
      shippingFee: 0,
      promoCodeId: undefined,
      trackingNumber: '',
      discountAmount: 0,
      totalPriceWithShipping: 0,
      user: UserUtils.getEmpty(),
      items: [],
      payments: []
    };
  }

  // Suppression de getEmptyAddress car on utilise celui de UserUtils

  public static getEmptyOrders(count: number = 1): Order[] {
    return Array(count).fill(null).map(() => this.getEmptyOrder());
  }

  public static getEmptyOrderItem(): OrderItem {
    return {
      id: '',
      product: ProductUtils.getEmptySingle(),
      orderId: '',
      quantity: 0,
      price: 0
    };
  }

  public static getEmptyOrderItems(count: number = 1): OrderItem[] {
    return Array(count).fill(null).map(() => this.getEmptyOrderItem());
  }

  public static getEmptyPayment(): Payment {
    return {
      idPayment: '',
      stripePaymentIntentId: '',
      amount: 0,
      refundedAmount: 0,
      currency: '',
      status: OrderStatus.PENDING_PAYMENT,
      paymentDate: new Date(),
      refundDate: undefined,
      orderId: '',
      userId: ''
    };
  }

  public static getEmptyPayments(count: number = 1): Payment[] {
    return Array(count).fill(null).map(() => this.getEmptyPayment());
  }

  public static isOrderPending(status: OrderStatus): boolean {
    return status === OrderStatus.PENDING_PAYMENT ||
      status === OrderStatus.PENDING_SHIPPING;
  }

  public static isOrderComplete(status: OrderStatus): boolean {
    return status === OrderStatus.DELIVERED;
  }

  public static isOrderCancelled(status: OrderStatus): boolean {
    return status === OrderStatus.CANCELLED ||
      status === OrderStatus.REFUNDED;
  }

  public static canUpdateStatus(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    switch (currentStatus) {
      case OrderStatus.PENDING_PAYMENT:
        return [OrderStatus.PAYMENT_FAILED, OrderStatus.PENDING_SHIPPING].includes(newStatus);
      case OrderStatus.PENDING_SHIPPING:
        return [OrderStatus.PROCESSING, OrderStatus.CANCELLED].includes(newStatus);
      case OrderStatus.PROCESSING:
        return [OrderStatus.SHIPPED, OrderStatus.CANCELLED].includes(newStatus);
      case OrderStatus.SHIPPED:
        return [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(newStatus);
      case OrderStatus.DELIVERED:
        return [OrderStatus.REFUNDED].includes(newStatus);
      default:
        return false;
    }
  }

  public static getNextPossibleStatuses(currentStatus: OrderStatus): OrderStatus[] {
    switch (currentStatus) {
      case OrderStatus.PENDING_PAYMENT:
        return [OrderStatus.PAYMENT_FAILED, OrderStatus.PENDING_SHIPPING];
      case OrderStatus.PENDING_SHIPPING:
        return [OrderStatus.PROCESSING, OrderStatus.CANCELLED];
      case OrderStatus.PROCESSING:
        return [OrderStatus.SHIPPED, OrderStatus.CANCELLED];
      case OrderStatus.SHIPPED:
        return [OrderStatus.DELIVERED, OrderStatus.CANCELLED];
      case OrderStatus.DELIVERED:
        return [OrderStatus.REFUNDED];
      default:
        return [];
    }
  }
}
