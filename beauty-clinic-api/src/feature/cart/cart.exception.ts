import {ApiException} from "@common/api/api.exception";
import {ApiCodeResponse} from "@common/api";

export class CreateCartException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CART_CREATE_ERROR, 200);
    }
}

export class AddItemToCartException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CART_ADD_ITEM_ERROR, 200);
    }
}

export class UpdateCartException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CART_UPDATE_ERROR, 200);
    }
}

export class RemoveCartException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CART_REMOVE_ERROR, 200);
    }
}

export class CartNotFoundException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CART_NOT_FOUND_ERROR, 200);

    }
}

