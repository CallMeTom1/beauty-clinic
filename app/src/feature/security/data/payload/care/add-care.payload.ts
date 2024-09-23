import {Payload} from "@shared-core";

export interface AddCarePayload extends Payload {
  name: string;
  beauty_care_machine: string;
  category: string;
  zone: string;
  sessions: number;
  price: number;
  duration: string;
  time_between: string;
  description: string;
}
