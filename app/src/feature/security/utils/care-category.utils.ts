import {CareCategory} from "../data/model/care-category/care-category.business";

export class CareCategoryUtils {
  public static getEmpties(): CareCategory[] {
    return [{
      category_id: '',
      name: '',
      description: '',
      isPublished: false
    }]
  }
}
