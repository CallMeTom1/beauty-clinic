export interface UpdateProductPayload {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  quantity_stored?: number;
  promo_percentage?: number;
}
