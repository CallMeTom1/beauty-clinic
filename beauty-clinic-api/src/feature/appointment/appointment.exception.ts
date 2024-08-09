import {ApiException} from "@common/api/api.exception";
import {ApiCodeResponse} from "@common/api";

export class CreateAppointmentException extends ApiException {
    constructor() {
        super(ApiCodeResponse.APPOINTMENT_CREATE_ERROR, 401);
    }
}

export class UpdateAppointmentStatusException extends ApiException {
    constructor() {
        super(ApiCodeResponse.APPOINTMENT_STATUS_UPDATE_ERROR, 401);
    }
}

export class AppointmentNotFoundException extends ApiException {
    constructor() {
        super(ApiCodeResponse.APPOINTMENT_NOT_FOUND, 404);
    }
}

export class HolidayConflictException extends ApiException {
    constructor() {
        super(ApiCodeResponse.APPOINTMENT_HOLIDAY_CONFLICT, 409);
    }
}

export class BusinessHoursConflictException extends ApiException {
    constructor() {
        super(ApiCodeResponse.APPOINTMENT_BUSINESS_HOURS_CONFLICT, 409);
    }
}

export class AppointmentConflictException extends ApiException {
    constructor() {
        super(ApiCodeResponse.APPOINTMENT_CONFLICT, 409);
    }
}

export class AppointmentDateException extends ApiException {
    constructor() {
        super(ApiCodeResponse.APPOINTMENT_DATE_INVALID, 400);
    }
}


