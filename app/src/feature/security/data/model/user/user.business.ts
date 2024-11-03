import {Address} from "./address.business";

export interface User {
  idUser: string;
  role: string;
  token: string;
  mail: string;
  username:string
  firstname: string;
  lastname: string;
  phonenumber: string | null;
  addresses: Address[];
}
