import {Business} from "@shared-core";
import {CartItem} from "./cart-item.business";

export interface Cart extends Business {
  idCart: string;
  items: CartItem[];
  totalPrice?: number;  // Optionnel : Peut être calculé côté serveur
  status?: string;      // Optionnel : Peut indiquer l'état actuel du panier (ex: "en cours")
}
