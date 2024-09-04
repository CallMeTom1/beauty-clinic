import {ApiException} from "@common/api/api.exception";
import {ApiCodeResponse} from "@common/api";

export class BusinessHoursUpdateException extends ApiException {
    constructor() {
        super(ApiCodeResponse.BUSINESSHOURS_UPDATE_ERROR, 401);
    }
}

export class BusinessHoursNotFoundException extends ApiException {
    constructor() {
        super(ApiCodeResponse.BUSINESSHOURS_NOT_FOUND, 401);
    }
}

export class BusinessHoursInitException extends ApiException {
    constructor() {
        super(ApiCodeResponse.BUSINESSHOURS_INIT_ERROR, 401);
    }
}

export class BusinessHoursCloseException extends ApiException {
    constructor() {
        super(ApiCodeResponse.BUSINESSHOURS_CLOSE_ERROR, 401);
    }
}

export class BusinessHoursOpenException extends ApiException {
    constructor() {
        super(ApiCodeResponse.BUSINESSHOURS_OPEN_ERROR, 401);
    }
}

