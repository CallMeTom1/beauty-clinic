import {Business} from "@shared-core";
import {Address} from "../user/address.business";

export interface Clinic extends Business {
  clinic_id: string;
  name: string;
  description: string;
  clinic_address: Address | null;
  phone_number: string;
  mail: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  linkedin_url: string;
  clinic_logo: string;

}
