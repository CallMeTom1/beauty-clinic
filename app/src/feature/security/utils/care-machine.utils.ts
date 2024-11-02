import {CareMachine} from "../data/model/machine/machine.business";
import {Care} from "../data/model/care/care.business";
import {CareUtils} from "./care.utils";

export class CareMachineUtils {
  public static getEmpties(): CareMachine[] {
    return [{
      care_machine_id: '',
      name: '',
      description: '',
      cares: CareUtils.getEmpties()
    }]

  }
}
