import {Review} from "../data/model/review/review.business";
import {User} from "../data/model/user";
import {Product} from "../data/model/product/product.business";
import {Care} from "../data/model/care/care.business";
import {UserUtils} from "@feature-security";
import {ProductUtils} from "./product.utils";
import {CareUtils} from "./care.utils";

export class ReviewUtils {
  private static readonly EMPTY_PRODUCT: Product = {
    product_id: '',
    name: '',
    description: '',
    initial_price: 0,
    is_promo: false,
    maxQuantity: 1,
    minQuantity: 3,
    quantity_stored: 0,
    product_image: '',
    promo_percentage: 0,
    isPublished: false,
    categories: [],
    price_discounted: 0,
    reviews: [] // Sans appel à ReviewUtils
  };

  public static getEmpties(): Review[] {
    return [{
      review_id: '',
      user: UserUtils.getEmpty(),
      rating: 0,
      comment: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      product: this.EMPTY_PRODUCT,
      care: CareUtils.getEmpty(),
    }];
  }
}
