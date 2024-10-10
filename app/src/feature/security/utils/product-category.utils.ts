import {CategoryProductDto} from "../data/model/category-product/category-business.dto";
import {User} from "../data/model/user";
import {CategoryProduct} from "../data/model/category-product/category-product.business";

export class ProductCategoryUtils {

  public static fromDtos(dtos: CategoryProductDto[]): CategoryProduct[] {
    return dtos.map(dto => ({
      product_category_id: dto.product_category_id,
      name: dto.name,
      product_category_image: dto.product_category_image,
      isPublished: dto.isPublished
    }));
  }


  public static getEmpties(): CategoryProduct[] {
    return [{
      product_category_id: '',
      name: '',
      product_category_image: '',
      isPublished: false
    }]
  }

  public static getEmpty(): CategoryProduct {
    return {
      product_category_id: '',
      name: '',
      product_category_image: '',
      isPublished: false
    }
  }

  public static toDto(categoryProduct: CategoryProduct){
    return {
      product_category_id: categoryProduct.product_category_id,
      name: categoryProduct.name,
      product_category_image: categoryProduct.product_category_image,
      isPublished: categoryProduct.isPublished
    }
  }


}
