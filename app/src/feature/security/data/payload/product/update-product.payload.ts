export interface UpdateProductPayload {
  product_id: string;
  name?: string;
  description?: string;
  initial_price?: number;
  quantity_stored?: number;
  minQuantity?: number;
  maxQuantity?: number;
  isPublished?: boolean;
  category_ids?: string[];
  is_promo?: boolean;
  promo_percentage?: number;
}
