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
      phoneNumber: dto.phoneNumber,
      shippingAddress: dto.shippingAddress, // Laisse null jusqu'à l'intégration correcte
      addresses: dto.addresses,
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
      addresses: Utils
    };
  }

  public static getEmptyAddress(): Address{
    return {

    }
  }

}
