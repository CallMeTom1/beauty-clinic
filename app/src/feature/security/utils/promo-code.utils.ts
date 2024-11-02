import {PromotionalCodeDto} from "../data/model/promotional-code/promotional-code.dto";
import {PromotionalCode} from "../data/model/promotional-code/promotional-code.business";

export class PromoCodeUtils {
  public static fromDtos(dtos: PromotionalCodeDto[]): PromotionalCode[] {
    return dtos.map(dto => ({
      promo_code_id: dto.promo_code_id,
      code: dto.code,
      percentage: dto.percentage,
      maxUses: dto.maxUses,
      usedCount: dto.usedCount,
      validFrom: new Date(dto.validFrom),
      validTo: new Date(dto.validTo),
      isActive: dto.isActive
    }));
  }

  public static toDto(business: PromotionalCode): PromotionalCodeDto {
    return {
      promo_code_id: business.promo_code_id,
      code: business.code,
      percentage: business.percentage,
      maxUses: business.maxUses,
      usedCount: business.usedCount,
      validFrom: business.validFrom,
      validTo: business.validTo,
      isActive: business.isActive
    };
  }

  public static getEmpties(): PromotionalCode[] {
    return [{
      promo_code_id: '',
      code: '',
      percentage: 0,
      maxUses: 0,
      usedCount: 0,
      validFrom: new Date(),
      validTo: new Date(),
      isActive: true
    }];
  }

  public static getEmpty(): PromotionalCode {
    return {
      promo_code_id: '',
      code: '',
      percentage: 0,
      maxUses: 0,
      usedCount: 0,
      validFrom: new Date(),
      validTo: new Date(),
      isActive: true
    };
  }
}
