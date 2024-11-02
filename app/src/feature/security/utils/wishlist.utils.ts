import {Wishlist} from "../data/model/wishlist/wishlist.business";
import {UserUtils} from "@feature-security";
import {ProductUtils} from "./product.utils";
import {CareUtils} from "./care.utils";

export class WishlistUtils {
  public static getEmpty(): Wishlist{
    return {
      wishlist_id: '',
      user: UserUtils.getEmpty(),
      products: ProductUtils.getEmpty(),
      cares: [CareUtils.getEmpty()],
    }
  }

}
