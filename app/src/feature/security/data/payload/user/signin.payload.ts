import {Payload} from "@shared-core";

export interface SignInPayload extends Payload{
    mail: string;
    password: string;
}
