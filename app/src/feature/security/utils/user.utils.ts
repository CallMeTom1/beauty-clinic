import {User, UserDto} from "../data/model/user";

export class UserUtils {

  public static fromDto(dto: UserDto): User {
    return {
      idUser: dto.idUser,
      role: dto.role,
      token: dto.token,
      username: dto.username,
      phoneNumber: dto.phoneNumber,
      firstname: dto.firstname,
      lastname: dto.lastname,
      isEmpty: false,
      id: dto.idUser,
      str: dto.username,
      profileImage: dto.profileImage,
    };
  }

  public static getEmpty(): User {
    return {
      idUser: "",
      role: "",
      token: "",
      username: "",
      phoneNumber: "",
      firstname: "",
      lastname: "",
      isEmpty: true,
      id: "",
      str: "",
      profileImage: ""
    };
  }

  public static toDto(business: User): UserDto {
    return {
      idUser: business.idUser,
      role: business.role,
      token: business.token,
      username: business.username,
      phoneNumber: business.phoneNumber,
      firstname: business.firstname,
      lastname: business.lastname,
      profileImage: business.profileImage
    };
  }
}
