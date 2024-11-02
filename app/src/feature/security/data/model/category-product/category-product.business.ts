import { Business } from "@shared-core";

export interface CategoryProduct extends Business {
  product_category_id: string;
  name: string;
  description: string;
  isPublished: boolean;
}
