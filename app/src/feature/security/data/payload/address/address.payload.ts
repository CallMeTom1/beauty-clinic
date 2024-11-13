// add-address.payload.ts
export interface AddAddressPayload {
  firstname: string;
  lastname: string;
  road: string;
  nb: string;
  cp: string;
  town: string;
  country: string;
  complement?: string;
  label: string;
  isDefault: boolean;
  isShippingAddress: boolean;
  isBillingAddress: boolean;
}

// modify-address.payload.ts
export interface ModifyAddressPayload {
  addressId: string;
  firstname: string;
  lastname: string;
  road: string;
  nb: string;
  cp: string;
  town: string;
  country: string;
  complement?: string;
  label: string;
  isDefault: boolean;
  isShippingAddress: boolean;
  isBillingAddress: boolean;
}

// delete-address.payload.ts
export interface DeleteAddressPayload {
  addressId: string;
}
