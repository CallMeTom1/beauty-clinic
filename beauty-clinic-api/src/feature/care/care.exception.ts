import {ApiException} from "@common/api/api.exception";
import {ApiCodeResponse} from "@common/api";

export class CreateCareNotAdminException extends ApiException {
    constructor() {
        super(ApiCodeResponse.ADD_CARE_USER_N0T_ADMIN_ERROR, 401);
    }
}

export class ModifyCareNotAdminException extends ApiException {
    constructor() {
        super(ApiCodeResponse.MODIFY_CARE_USER_N0T_ADMIN_ERROR, 401);
    }
}

export class ModifyCareException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CARE_MODIFY_ERROR, 401);
    }
}

export class DeleteCareNotAdminException extends ApiException {
    constructor() {
        super(ApiCodeResponse.DELETE_CARE_USER_N0T_ADMIN_ERROR, 401);
    }
}

export class CareAlreadyExistException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CARE_ALREADY_EXIST_EXCEPTION, 401);
    }
}

export class CreateCareException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CARE_CREATE_ERROR, 401);
    }
}

export class CareNotFoundException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CARE_NOT_FOUND, 404);
    }
}

export class DeleteCareException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CARE_DELETE_ERROR, 404);
    }
}

export class GetCaresException extends ApiException {
    constructor() {
        super(ApiCodeResponse.CARE_GET_ERROR, 500);
    }
}


