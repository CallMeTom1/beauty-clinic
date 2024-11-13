import {Address} from "@common/model/address.entity";


export interface UserDetails {
    idUser: string;
    role: string;
    token: string;
    mail: string;
    firstname: string;
    lastname: string;
    username: string;
    phonenumber: string;
    addresses: Address[]

}
