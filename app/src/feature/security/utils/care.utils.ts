import {CareDto} from "../../care/data/model/care.dto";
import {Care} from "../../care/data/model/care.business";

export class CareUtils{

  public static fromDto(dto: CareDto): Care{
    return {
      care_id: dto.care_id,
      name: dto.name,
      beauty_care_machine: dto.beauty_care_machine,
      sessions: dto.sessions,
      time_between: dto.time_between,
      category: dto.category,
      zone: dto.zone,
      duration: dto.duration,
      price: dto.price
    }
  }

  public static getEmpty(): Care {
    return {
      care_id: "",
      name: "",
      beauty_care_machine: "",
      sessions: 0,
      time_between: "",
      category: "",
      zone: "",
      duration: "",
      price: 0
    }
  }

  public static toDto(business: Care): CareDto{
    return {
      care_id: business.care_id,
      name: business.name,
      beauty_care_machine: business.beauty_care_machine,
      sessions: business.sessions,
      time_between: business.time_between,
      category: business.category,
      zone: business.zone,
      duration: business.duration,
      price: business.price
    }
  }

  public static getEmpties(): Care[] {
    return [{
      care_id: "",
      name: "",
      beauty_care_machine: "",
      sessions: 0,
      time_between: "",
      category: "",
      zone: "",
      duration: "",
      price: 0
    }]
  }


}
