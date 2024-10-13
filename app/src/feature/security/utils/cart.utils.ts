import {CartDto} from "../data/model/cart/cart.dto";
import {Cart} from "../data/model/cart/cart.business";
import {CartItem} from "../data/model/cart/cart-item.business";
import {CartItemDto} from "../data/model/cart/cart-item.dto";

export class CartUtils {

  public static fromDtos(dtos: CartDto[]): Cart[] {
    return dtos.map(dto => ({
      idCart: dto.idCart,
      items: dto.items.map(itemDto => CartUtils.cartItemFromDto(itemDto)),
      totalPrice: dto.totalPrice,
      status: dto.status
    }));
  }

  public static getEmpty(): Cart {
    return {
      idCart: '',
      items: [],
      totalPrice: 0,
      status: 'empty'
    };
  }

  public static toDto(business: Cart): CartDto {
    return {
      idCart: business.idCart,
      items: business.items.map(item => CartUtils.cartItemToDto(item)),
      totalPrice: business.totalPrice,
      status: business.status
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
