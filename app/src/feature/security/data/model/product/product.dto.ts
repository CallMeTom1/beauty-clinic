import {CategoryProduct} from "../category-product/category-product.business";
import {Review} from "../review/review.business";

export interface ProductDto {
  product_id: string;
  name: string;
  description: string;
  initial_price: number;
  minQuantity: number;
  maxQuantity: number;
  quantity_stored: number;
  product_image: string;
  is_promo: boolean;
  isPublished: boolean;
  promo_percentage: number;
  price_discounted: number;
  categories: CategoryProduct[];
  reviews: Review[]
}
