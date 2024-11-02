import {Business} from "@shared-core";

export interface CareCategory extends Business {
  category_id: string;
  name: string;
  description: string;
  isPublished: boolean;
}
