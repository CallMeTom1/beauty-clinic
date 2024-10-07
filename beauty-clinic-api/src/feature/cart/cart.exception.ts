import {ApiException} from "@common/api/api.exception";
import {ApiCodeResponse} from "@common/api";

export class CreateCartException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CART_CREATE_ERROR, 200);
    }
}

