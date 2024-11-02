import {OrderStatus} from "../../model/order/order-status.enum";

export interface UpdateStatusOrderPayload {
  idOrder: string;
  status: OrderStatus;
}
