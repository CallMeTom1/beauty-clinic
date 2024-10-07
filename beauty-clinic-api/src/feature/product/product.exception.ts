import {ApiException} from "@common/api/api.exception";
import {ApiCodeResponse} from "@common/api";

export class CreateProductException extends ApiException {
    constructor() {
        super(ApiCodeResponse.PRODUCT_CREATE_ERROR, 200);
    }
}

export class UpdateProductException extends ApiException {
    constructor() {
        super(ApiCodeResponse.PRODUCT_UPDATE_ERROR, 200);
    }
}

export class AddCategoryToProductException extends ApiException {
    constructor() {
        super(ApiCodeResponse.PRODUCT_ADD_CATEGORY_ERROR, 200);
    }
}

export class PublishProductException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CATEGORY_PRODUCT_PUBLISH_ERROR, 200);
    }
}

export class UnpublishProductException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CATEGORY_PRODUCT_UNPUBLISH_ERROR, 200);
    }
}

// Exception pour l'erreur de suppression de catégorie-produit
export class DeleteProductException extends ApiException {
    constructor() {
        super(ApiCodeResponse.PRODUCT_DELETE_ERROR, 200);
    }
}

// Exception pour la catégorie-produit non trouvée
export class ProductNotFoundException extends ApiException {
    constructor() {
        super(ApiCodeResponse.PRODUCT_NOT_FOUND, 404);
    }
}

export class UpdateProductImageException extends ApiException {
    constructor() {
        super(ApiCodeResponse.PRODUCT_UPDATE_ERROR_IMAGE, 200);
    }
}