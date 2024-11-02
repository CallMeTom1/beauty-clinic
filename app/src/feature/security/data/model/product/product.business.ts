import {Business} from "@shared-core";
import {CategoryProduct} from "../category-product/category-product.business";
import {Review} from "../review/review.business";

export interface Product extends Business {
  product_id: string;
  name: string;
  description: string;
  initial_price: number;
  minQuantity: number;
  maxQuantity: number;
  quantity_stored: number;
  product_image: string;
  is_promo: boolean;
  price_discounted: number;
  isPublished: boolean;
  promo_percentage: number;
  categories: CategoryProduct[];
  reviews: Review[]
}
