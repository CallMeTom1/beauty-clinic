import {ApiException} from "@common/api/api.exception";
import {ApiCodeResponse} from "@common/api";

export class BusinessHoursCreationException extends ApiException {
    constructor() {
        super(ApiCodeResponse.BUSINESSHOURS_CREATE_ERROR, 401);
    }
}

export class BusinessHoursUpdateException extends ApiException {
    constructor() {
        super(ApiCodeResponse.BUSINESSHOURS_UPDATE_ERROR, 401);
    }
}

export class BusinessHoursDayOfWeekException extends ApiException {
    constructor() {
        super(ApiCodeResponse.BUSINESSHOURS_DAY_OF_WEEK_ERROR, 401);
    }
}

export class BusinessHoursDeleteException extends ApiException {
    constructor() {
        super(ApiCodeResponse.BUSINESSHOURS_DELETE_ERROR, 401);
    }
}

export class BusinessHoursNotFoundException extends ApiException {
    constructor() {
        super(ApiCodeResponse.BUSINESSHOURS_NOT_FOUND, 401);
    }
}