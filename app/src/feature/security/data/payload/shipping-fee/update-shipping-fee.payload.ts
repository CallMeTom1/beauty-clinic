// shipping/update-shipping-fee.payload.ts
export interface UpdateShippingFeePayload {
  shipping_fee_id: string;
  amount?: number;
  freeShippingThreshold?: number;
  description?: string;
}
