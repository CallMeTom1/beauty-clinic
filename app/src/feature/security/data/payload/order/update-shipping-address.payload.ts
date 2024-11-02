export interface UpdateShippingAddressPayload {
  idOrder: string;
  road: string;
  nb: string;
  cp: string;
  town: string;
  country: string;
  complement?: string;
}
