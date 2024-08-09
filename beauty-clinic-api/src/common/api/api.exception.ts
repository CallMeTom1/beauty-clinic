import {HttpException, ValidationError} from '@nestjs/common';
import {ApiCodeResponse} from "@common/api/enum";
export class ApiException extends HttpException{
    constructor(code:ApiCodeResponse, status:number) {
        super({
            code: code,
            data: null,
            result: false
        }, status);
    }
}
export class ValidationException extends HttpException {
    constructor(errors: ValidationError[]) {
        console.log(errors);
        super({
            code: ApiCodeResponse.PAYLOAD_IS_NOT_VALID,
            data: errors.map((e) => Object.values(e.constraints)).flat(),
            result: false
        }, 499);
    }
}
