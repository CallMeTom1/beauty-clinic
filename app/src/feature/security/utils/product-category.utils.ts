import {CategoryProductDto} from "../data/model/category-product/category-business.dto";
import {User} from "../data/model/user";
import {CategoryProduct} from "../data/model/category-product/category-product.business";

export class ProductCategoryUtils {

  public static fromDtos(dtos: CategoryProductDto[]): CategoryProduct[] {
    return dtos.map(dto => ({
      product_category_id: dto.product_category_id,
      name: dto.name,
      description: dto.description,
      isPublished: dto.isPublished
    }));
  }


  public static getEmpties(): CategoryProduct[] {
    return [{
      product_category_id: '',
      name: '',
      description: '',
      isPublished: false
    }]
  }

  public static getEmpty(): CategoryProduct {
    return {
      product_category_id: '',
      name: '',
      description: '',
      isPublished: false
    }
  }

  public static toDto(categoryProduct: CategoryProduct){
    return {
      product_category_id: categoryProduct.product_category_id,
      name: categoryProduct.name,
      isPublished: categoryProduct.isPublished
    }
  }


}
