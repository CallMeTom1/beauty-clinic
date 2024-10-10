export class ModifyUserPayload {
    firstname?: string;
    lastname?: string;
    phoneNumber?: string;
    shippingAddress?: Partial<AddressPayload>;
    billingAddress?: Partial<AddressPayload>;
}

export class AddressPayload {
    road?: string;
    nb?: string;
    cp?: string;
    town?: string;
    country?: string;
    complement?: string;
}
