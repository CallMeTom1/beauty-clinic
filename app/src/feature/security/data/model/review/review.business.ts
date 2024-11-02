import {Business} from "@shared-core";
import {User} from "../user";
import {Product} from "../product/product.business";
import {Care} from "../care/care.business";

export interface Review extends Business {
  review_id: string;
  user: User;
  rating: number; // Note donnée par l'utilisateur (par exemple de 1 à 5)
  comment: string; // Commentaire optionnel
  createdAt: Date; // Date de création automatique
  updatedAt: Date; // Date de mise à jour automatique
  product: Product;
  care: Care;

}
