export interface CreatePromoCodePayload {
  code: string;
  percentage: number;
  maxUses: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
}
