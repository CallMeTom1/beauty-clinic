import {Business} from "@shared-core";

export interface PromotionalCode extends Business {
  promo_code_id: string;
  code: string;
  percentage: number;
  maxUses: number;
  usedCount: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
}
