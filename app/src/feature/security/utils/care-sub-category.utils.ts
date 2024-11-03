import {CareSubCategory} from "../data/model/care-sub-category/care-sub-category.business";

export class CareSubCategoryUtils {
  public static getEmpties(): CareSubCategory[] {
    return [{
      sub_category_id: '',
      name: '',
      description: '',
      isPublished: false,
      sub_category_image: ''
    }]
  }
}
