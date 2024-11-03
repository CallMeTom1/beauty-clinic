import {User, UserDto} from "../data/model/user";
import {Address} from "../data/model/user/address.business";

export class UserUtils {
  public static fromDto(dto: UserDto): User {
    return {
      idUser: dto.idUser,
      role: dto.role,
      token: dto.token,
      firstname: dto.firstname,
      lastname: dto.lastname,
      phonenumber: dto.phonenumber,
      addresses: dto.addresses || [],
      username: dto.username,
      mail: dto.mail
    };
  }

  public static getEmpty(): User {
    return {
      idUser: "",
      role: "",
      token: "",
      firstname: "",
      lastname: "",
      phonenumber: null,
      addresses: [],
      username: "",
      mail: ""
    };
  }

  public static getEmptyAddress(): Address {
    return {
      address_id: "",
      firstname: "",
      lastname: "",
      road: "",
      nb: "",
      cp: "",
      town: "",
      country: "",
      complement: "",
      label: "",
      isDefault: "false",
      isShippingAddress: false,
      isBillingAddress: false
    };
  }
}
