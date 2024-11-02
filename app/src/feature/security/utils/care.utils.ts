import {Care} from "../data/model/care/care.business";

export class CareUtils {
  public static getEmpty(): Care {
    return {
      care_id: "",
      name: "",
      description: "",
      care_image: null,
      initial_price: 0,
      sessions: 0,
      duration: 0,
      time_between: null,
      is_promo: false,
      promo_percentage: null,
      price_discounted: null,
      isPublished: false,
      created_at: new Date(),
      updated_at: new Date(),
      machines: [],
      categories: [],
      subCategories: [],
      bodyZones: [],
      reviews: []
    };
  }

  public static getEmpties(): Care[] {
    return [this.getEmpty()];
  }
}
