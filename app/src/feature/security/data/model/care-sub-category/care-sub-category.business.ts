import {Business} from "@shared-core";

export interface CareSubCategory extends Business {
  sub_category_id: string;
  name: string;
  description: string;
  isPublished: boolean;
}
