import {Address} from "./address.business";

export interface UserDto {
  idUser: string;
  role: string;
  token: string;
  mail: string;
  firstname: string;
  lastname: string;
  phonenumber: string | null;
  username: string;
  addresses: Address[];
}
