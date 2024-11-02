import {Business} from "@shared-core";
import {CartItem} from "./cart-item.business";
import {CartItemDto} from "./cart-item.dto";
import {User} from "../user";
import {PromotionalCode} from "../promotional-code/promotional-code.business";

export interface CartDto {
  idCart: string;
  items: CartItemDto[];
  userId: string;
  promoCodeId?: string;
  discountAmount?: number;
}
