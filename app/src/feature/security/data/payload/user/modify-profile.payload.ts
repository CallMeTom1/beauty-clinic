export interface AddressPayload {
  address_id?: string;
  firstname?: string;
  lastname?: string;
  road?: string;
  nb?: string;
  cp?: string;
  town?: string;
  country?: string;
  complement?: string;
  label?: string;
  isDefault?: string;
  isShippingAddress?: boolean;
  isBillingAddress?: boolean;
}

// Typage pour ModifyProfilePayload côté client (correspond à ModifyUserPayload côté serveur)
export interface ModifyProfilePayload {
  firstname?: string;
  lastname?: string;
  phonenumber?: string;
  addressType?: 'shipping' | 'billing';
  Address?: Partial<AddressPayload>;
  label?: string
  username?: string
  isDefault?: string;
}
