export interface AddressDetails {
    road: string;
    nb: string;
    cp: string;
    town: string;
    country: string;
    complement: string;
}

export interface UserDetails {
    idUser: string;
    role: string;
    token: string;
    profileImage: string | null;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    profileImageUrl: string;
    hasCustomImage: boolean;
    shippingAddress: AddressDetails | null;
    billingAddress: AddressDetails | null;
}
