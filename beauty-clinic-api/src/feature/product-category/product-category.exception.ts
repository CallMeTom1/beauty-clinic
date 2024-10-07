import {ApiException} from "@common/api/api.exception";
import {ApiCodeResponse} from "@common/api";

export class CreateProductCategoryException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CATEGORY_PRODUCT_CREATE_ERROR, 200);
    }
}

// Exception pour l'erreur de mise à jour de catégorie-produit
export class UpdateProductCategoryException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CATEGORY_PRODUCT_UPDATE_ERROR, 200);
    }
}

export class UpdateProductCategoryImageException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CATEGORY_PRODUCT_UPDATE_ERROR_IMAGE, 200);
    }
}

export class PublishProductCategoryException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CATEGORY_PRODUCT_PUBLISH_ERROR, 200);
    }
}

export class UnpublishProductCategoryException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CATEGORY_PRODUCT_UNPUBLISH_ERROR, 200);
    }
}



// Exception pour l'erreur de suppression de catégorie-produit
export class DeleteProductCategoryException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CATEGORY_PRODUCT_DELETE_ERROR, 200);
    }
}

// Exception pour la catégorie-produit non trouvée
export class ProductCategoryNotFoundException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CATEGORY_PRODUCT_NOT_FOUND, 404);
    }
}