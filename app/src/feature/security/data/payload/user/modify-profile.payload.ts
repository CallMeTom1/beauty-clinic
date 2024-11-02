export interface AddressPayload {
  road?: string;
  nb?: string;
  cp?: string;
  town?: string;
  country?: string;
  complement?: string;

}

// Typage pour ModifyProfilePayload côté client (correspond à ModifyUserPayload côté serveur)
export interface ModifyProfilePayload {
  firstname?: string;
  lastname?: string;
  phoneNumber?: string;
  addressType?: 'shipping' | 'billing';
  Address?: Partial<AddressPayload>;
}
