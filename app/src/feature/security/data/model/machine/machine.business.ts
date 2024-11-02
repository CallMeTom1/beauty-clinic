import {Business} from "@shared-core";
import {Care} from "../care/care.business";

export interface CareMachine extends Business {
  care_machine_id: string;
  name: string;
  description: string;
  cares: Care[];

}
