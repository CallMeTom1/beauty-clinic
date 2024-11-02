import {CartDto} from "../data/model/cart/cart.dto";
import {Cart} from "../data/model/cart/cart.business";
import {CartItem} from "../data/model/cart/cart-item.business";
import {CartItemDto} from "../data/model/cart/cart-item.dto";
import {PromoCodeUtils} from "./promo-code.utils";
import {UserUtils} from "@feature-security";

export class CartUtils {



  public static getEmpty(): Cart {
    return {
      idCart: '',
      items: [],
      userId: '',
      promoCode: PromoCodeUtils.getEmpty(),
      discountAmount: 0,
    };
  }

  public static cartItemFromDto(dto: CartItemDto): CartItem {
    return {
      idCartItem: dto.idCartItem,
      product: dto.product,
      quantity: dto.quantity,
    };
  }

  public static cartItemToDto(business: CartItem): CartItemDto {
    return {
      idCartItem: business.idCartItem,
      product: business.product,
      quantity: business.quantity,
    };
  }
}
