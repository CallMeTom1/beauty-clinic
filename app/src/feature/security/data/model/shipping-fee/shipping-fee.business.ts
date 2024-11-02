import {Business} from "@shared-core";

export interface ShippingFee extends Business {
  shipping_fee_id: string;
  amount: number;
  freeShippingThreshold: number;
  description: string;
}
