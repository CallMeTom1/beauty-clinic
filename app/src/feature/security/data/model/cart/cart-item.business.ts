import { Product } from "../product/product.business";

export interface CartItem {
  idCartItem: string;
  product: Product;
  quantity: number;
}
