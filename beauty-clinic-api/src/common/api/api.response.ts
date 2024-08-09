import {ApiCodeResponse} from "@common/api/enum";
export interface ApiResponse {
    code: ApiCodeResponse;
    data: any;
    result: boolean;
}