import {Business} from "@shared-core";

export interface Holiday extends Business {
  holiday_id: string;
  holiday_date: Date;  // Stocke la date du jour férié, par exemple, '2024-12-25'

}
