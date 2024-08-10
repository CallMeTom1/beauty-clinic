import {ApiException} from "@common/api/api.exception";
import {ApiCodeResponse} from "@common/api";

export class HolidayNotDateException extends ApiException{
    constructor() {
        super(ApiCodeResponse.HOLIDAY_NOT_DATE_ERROR, 401);
    }
}

export class HolidayAlreadyExistException extends ApiException{
    constructor() {
        super(ApiCodeResponse.HOLIDAY_ALREADY_EXIST_ERROR, 401);
    }
}

export class HolidayCreateException extends ApiException{
    constructor() {
        super(ApiCodeResponse.HOLIDAY_CREATE_ERROR, 401);
    }
}

export class HolidayBadDateException extends ApiException{
    constructor() {
        super(ApiCodeResponse.HOLIDAY_BAD_DATE_ERROR, 401);
    }
}


