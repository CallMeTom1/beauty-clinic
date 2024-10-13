import { Product } from "../product/product.business";

export interface CartItemDto {
  idCartItem: string;
  product: Product;
  quantity: number;
}
