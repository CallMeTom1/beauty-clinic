import {Payload} from "@shared-core";

export interface EditCarePayload extends Payload{
  name: string;
  beauty_care_machine: string;
  category: string;
  zone: string;
  sessions: number;
  price: number;
  duration: string;
  time_between: string;
}
