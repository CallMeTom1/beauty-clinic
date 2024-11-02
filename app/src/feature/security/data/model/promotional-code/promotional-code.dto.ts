export interface PromotionalCodeDto {
  promo_code_id: string;
  code: string;
  percentage: number;
  maxUses: number;
  usedCount: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
}
