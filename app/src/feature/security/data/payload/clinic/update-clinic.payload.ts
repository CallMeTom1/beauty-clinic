import {Address} from "../../model/user/address.business";

export interface UpdateClinicPayload {
  clinic_id: string;
  name?: string;
  description?: string;
  clinic_address?: Address;
  phone_number?: string;
  mail?: string;
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  linkedin_url?: string;
  clinic_logo?: string;
}
