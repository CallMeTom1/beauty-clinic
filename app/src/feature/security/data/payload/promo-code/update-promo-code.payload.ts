export interface UpdatePromoCodePayload {
  promo_code_id: string;
  code?: string;
  percentage?: number;
  maxUses?: number;
  validFrom?: string;
  validTo?: string;
  isActive?: boolean;
}
