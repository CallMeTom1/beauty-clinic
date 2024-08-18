import { Payload } from "@shared-core";

export interface DeleteCarePayload extends Payload {
  care_id: string;
}
