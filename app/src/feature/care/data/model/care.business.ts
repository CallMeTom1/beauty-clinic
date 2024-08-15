import {Business} from "@shared-core";

export interface Care extends Business{
  care_id: string;
  name: string;
  beauty_care_machine: string;
  category: string;
  zone: string;
  sessions: number;
  price: number;
  duration: string;
  time_between: string;
}
