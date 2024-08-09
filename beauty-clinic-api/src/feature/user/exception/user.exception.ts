import {ApiException} from "@common/api/api.exception";
import {ApiCodeResponse} from "@common/api";

export class UserCreationException extends ApiException {
    constructor() {
        super(ApiCodeResponse.USER_CREATION_ERROR, 200);
    }
}