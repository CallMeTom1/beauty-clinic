import { Business } from "@shared-core";

export interface CategoryProduct extends Business {
  product_category_id: string;
  name: string;
  product_category_image: { data: number[] } | string; // Typage explicite du Buffer avec 'data'
  isPublished: boolean;
}
