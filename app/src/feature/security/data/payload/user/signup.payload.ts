import {Payload} from "@shared-core";

export interface SignupPayload extends Payload{
  username: string;
  firstname: string;
  lastname: string;
  mail: string;
  password: string;
}
