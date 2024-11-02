import {ProductDto} from "../data/model/product/product.dto";
import {Product} from "../data/model/product/product.business";
import {ReviewUtils} from "./review.utils";

export class ProductUtils {

  public static fromDtos(dtos: ProductDto[]): Product[] {
    return dtos.map(dto => ({
      product_id: dto.product_id,
      name: dto.name,
      description: dto.description,
      initial_price: dto.initial_price,
      is_promo: dto.is_promo,
      maxQuantity: dto.maxQuantity,
      minQuantity: dto.minQuantity,
      quantity_stored: dto.quantity_stored,
      product_image: dto.product_image,
      promo_percentage: dto.promo_percentage,
      isPublished: dto.isPublished,
      price_discounted: dto.price_discounted,
      categories: dto.categories, // Assurez-vous que les catégories sont dans le bon format
      reviews: dto.reviews,
    }));
  }


  public static getEmpty(): Product[] {
    return [{
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
      reviews: ReviewUtils.getEmpties()
    }]
  }

  public static getEmptySingle(): Product {
    return {
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
      reviews: ReviewUtils.getEmpties()
    }
  }

  public static toDto(business: Product): ProductDto {
    return {
      product_id: business.product_id,
      name: business.name,
      description: business.description,
      initial_price: business.initial_price,
      is_promo: business.is_promo,
      maxQuantity: business.maxQuantity,
      minQuantity: business.minQuantity,
      quantity_stored: business.quantity_stored,
      product_image: business.product_image,
      promo_percentage: business.promo_percentage,
      isPublished: business.isPublished,
      categories: business.categories,
      price_discounted: business.price_discounted,
      reviews: business.reviews
    }
  }

}
