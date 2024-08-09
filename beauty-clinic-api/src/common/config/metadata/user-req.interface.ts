import {Role} from "@feature/security/data";

export type UserRequest = {
    idUser: string;
    username: string;
    email: string;
    token: string;
    role: Role;
    roles: Role[];
};