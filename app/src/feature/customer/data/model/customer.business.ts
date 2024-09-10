import {Business} from "@shared-core";

export interface Customer extends Business {
  idUser: string;
  phoneNumber?: string;
  firstname?: string;
  lastname?: string;
}
