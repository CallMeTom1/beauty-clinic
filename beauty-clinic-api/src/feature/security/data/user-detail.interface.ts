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
}