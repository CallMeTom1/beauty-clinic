import {Payload} from "@shared-core";

export interface UpdateCarePayload extends Payload {
  care_id: string;
  name?: string;
  description?: string;
  initial_price?: number;
  sessions?: number;
  duration?: number;
  time_between?: number;
  isPublished?: boolean;
  is_promo?: boolean;
  promo_percentage?: number;
  category_ids?: string[];
  sub_category_ids?: string[];
  body_zone_ids?: string[];
  machine_ids?: string[];
}
