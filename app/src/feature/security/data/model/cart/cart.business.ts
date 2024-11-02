import {Business} from "@shared-core";
import {CartItem} from "./cart-item.business";
import {User} from "../user";
import {PromotionalCode} from "../promotional-code/promotional-code.business";

// Cart
export interface Cart extends Business {
  idCart: string;
  items: CartItem[];
  userId: string;
  promoCode: PromotionalCode;
  discountAmount?: number;
}
