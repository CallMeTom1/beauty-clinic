import { Payload } from "@shared-core";

export interface EditCarePayload extends Payload {
  care_id: string;  // Identifiant du soin à mettre à jour
  name: string;
  beauty_care_machine: string;
  category: string;
  zone: string;
  sessions: number;
  price: number;
  duration: string;
  time_between: string;
}
