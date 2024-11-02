import {Business} from "@shared-core";
import {Care} from "../care/care.business";
import {User} from "../user";
import {Product} from "../product/product.business";

export interface Wishlist extends Business {
  wishlist_id: string;
  user: User;
  products: Product[];
  cares: Care[];
}
