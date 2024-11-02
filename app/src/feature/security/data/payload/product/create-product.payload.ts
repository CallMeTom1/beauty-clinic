export interface CreateProductPayload {
  name: string;
  description: string;
  initial_price: number;
  minQuantity?: number;
  maxQuantity?: number;
  product_image?: string;
  isPublished?: boolean;
  category_ids?: string[];
  quantity_stored: number;
  promo_percentage: number;
}
