import {ShippingFee} from "../data/model/shipping-fee/shipping-fee.business";
import {ShippingFeeDto} from "../data/model/shipping-fee/shipping-fee.dto";

export class ShippingFeeUtils {
  public static fromDtos(dtos: ShippingFeeDto[]): ShippingFee[] {
    return dtos.map(dto => this.fromDto(dto));
  }

  public static fromDto(dto: ShippingFeeDto): ShippingFee {
    return {
      shipping_fee_id: dto.shipping_fee_id,
      amount: dto.amount,
      freeShippingThreshold: dto.freeShippingThreshold,
      description: dto.description
    };
  }

  public static toDto(business: ShippingFee): ShippingFeeDto {
    return {
      shipping_fee_id: business.shipping_fee_id,
      amount: business.amount,
      freeShippingThreshold: business.freeShippingThreshold,
      description: business.description
    };
  }

  public static getEmpty(): ShippingFee {
    return {
      shipping_fee_id: '',
      amount: 0,
      freeShippingThreshold: 0,
      description: ''
    };
  }

  public static getEmptyList(count: number = 1): ShippingFee[] {
    return Array(count).fill(null).map(() => this.getEmpty());
  }

  /**
   * Calcule si la livraison est gratuite en fonction du montant total
   */
  public static isShippingFree(shippingFee: ShippingFee, totalAmount: number): boolean {
    return totalAmount >= shippingFee.freeShippingThreshold;
  }

  /**
   * Calcule le montant final des frais de livraison
   */
  public static calculateFinalShippingAmount(shippingFee: ShippingFee, totalAmount: number): number {
    return this.isShippingFree(shippingFee, totalAmount) ? 0 : shippingFee.amount;
  }

  /**
   * Calcule le montant restant pour la livraison gratuite
   */
  public static getRemainingForFreeShipping(shippingFee: ShippingFee, totalAmount: number): number {
    if (this.isShippingFree(shippingFee, totalAmount)) {
      return 0;
    }
    return shippingFee.freeShippingThreshold - totalAmount;
  }
}
