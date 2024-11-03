import {Business} from "@shared-core";

export interface CareSubCategory extends Business {
  sub_category_id: string;
  name: string;
  description: string;
  isPublished: boolean;
  sub_category_image: string;
  category_id?: string; // Ajout de la référence à la catégorie parente
}
