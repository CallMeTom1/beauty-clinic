import {Business} from "@shared-core";
import {Product} from "../product/product.business";

export interface OrderItem extends Business {
  id: string;
  product: Product
  orderId: string;
  quantity: number;
  price: number;
}
