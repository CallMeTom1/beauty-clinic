import {Business} from "@shared-core";
import {CareSubCategory} from "../care-sub-category/care-sub-category.business";

export interface CareCategory extends Business {
  category_id: string;
  name: string;
  description: string;
  isPublished: boolean;
  category_image: string;
  subCategories?: CareSubCategory[];
}
