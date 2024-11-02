import {Clinic} from "../data/model/clinic/clinic.business";
import {Address} from "../data/model/user/address.business";

export class ClinicUtils {
  public static getEmpty(): Clinic{
    return {
      clinic_id: '',
      name: '',
      description: '',
      clinic_address: null,
      phone_number: '',
      mail: '',
      facebook_url: '',
      instagram_url: 'string',
      tiktok_url: 'string',
      linkedin_url: 'string',
      clinic_logo: 'string',

    }
  }
}
