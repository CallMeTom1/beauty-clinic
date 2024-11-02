import {Business} from "@shared-core";

export interface Payment extends Business {
  idPayment: string;
  stripePaymentIntentId: string;
  amount: number;
  refundedAmount: number;
  currency: string;
  status: string;
  paymentDate: Date;
  refundDate?: Date;
  orderId?: string;
  userId: string;
}
