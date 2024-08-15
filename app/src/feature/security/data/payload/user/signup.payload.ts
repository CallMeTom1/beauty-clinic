import {Payload} from "@shared-core";

export interface SignupPayload extends Payload{
    username: string;
    password: string;
    mail: string;
    phoneNumber: string;
    firstname: string;
    lastname: string;
}
