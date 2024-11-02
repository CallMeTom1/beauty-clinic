import {Payload} from "@shared-core";

export interface UploadCareImagePayload extends Payload {
  careId: string;
  careImage: string;
}
