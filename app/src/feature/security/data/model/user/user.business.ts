import { Business } from "@shared-core";

export interface User extends Business {
  idUser: string;
  role: string;
  token: string;
  username: string;
  phoneNumber: string;
  firstname: string;
  lastname: string;
  profileImage: string;
  profileImageUrl: string;
  hasCustomProfileImage: boolean;
}
