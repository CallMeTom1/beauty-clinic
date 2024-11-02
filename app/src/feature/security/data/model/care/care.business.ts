import {Business} from "@shared-core";
import {CareMachine} from "../machine/machine.business";
import {CareCategory} from "../care-category/care-category.business";
import {CareSubCategory} from "../care-sub-category/care-sub-category.business";
import {BodyZone} from "../body-zone/body-zone.business";
import {Review} from "../review/review.business";

export interface Care extends Business{
  care_id: string;
  name: string;
  description: string;
  care_image: string | null;
  initial_price: number;
  sessions: number;
  duration: number;
  time_between: number | null;
  is_promo: boolean;
  promo_percentage: number | null;
  price_discounted: number | null;
  isPublished: boolean;
  created_at: Date;
  updated_at: Date;
  machines: CareMachine[];
  categories: CareCategory[];
  subCategories: CareSubCategory[];
  bodyZones: BodyZone[];
  reviews: Review[];
}
