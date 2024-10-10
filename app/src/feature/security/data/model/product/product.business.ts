import {Business} from "@shared-core";
import {CategoryProduct} from "../category-product/category-product.business";

export interface Product extends Business {
  product_id: string;
  name: string;
  description: string;
  price: number;
  quantity_stored: number;
  product_image: string;
  promo_percentage: number;
  isPublished: boolean;
  categories: CategoryProduct[];
}
