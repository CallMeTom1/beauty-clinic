import {BodyZone} from "../data/model/body-zone/body-zone.business";

export class BodyZoneUtils{
  public static getEmpties(): BodyZone[] {
    return [{
      body_zone_id: '',
      name: ''
    }]
  }
}
