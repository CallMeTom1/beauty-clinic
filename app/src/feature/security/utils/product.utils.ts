import {ProductDto} from "../data/model/product/product.dto";
import {Product} from "../data/model/product/product.business";

export class ProductUtils {

  public static fromDtos(dtos: ProductDto[]): Product[] {
    return dtos.map(dto => ({
      product_id: dto.product_id,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      quantity_stored: dto.quantity_stored,
      product_image: dto.product_image,
      promo_percentage: dto.promo_percentage,
      isPublished: dto.isPublished,
      categories: dto.categories // Assurez-vous que les catégories sont dans le bon format
    }));
  }


  public static getEmpty(): Product[] {
    return [{
      product_id: '',
      name: '',
      description: '',
      price: 0,
      quantity_stored: 0,
      product_image: '',
      promo_percentage: 0,
      isPublished: false,
      categories: []
    }]
  }

  public static toDto(business: Product): ProductDto {
    return {
      product_id: business.product_id,
      name: business.name,
      description: business.description,
      price: business.price,
      quantity_stored: business.quantity_stored,
      product_image: business.product_image,
      promo_percentage: business.promo_percentage,
      isPublished: business.isPublished,
      categories: business.categories
    }
  }

}
