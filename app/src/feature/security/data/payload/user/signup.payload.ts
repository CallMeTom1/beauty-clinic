import {Payload} from "@shared-core";

export interface SignupPayload extends Payload{
    password: string;
    mail: string;
}
