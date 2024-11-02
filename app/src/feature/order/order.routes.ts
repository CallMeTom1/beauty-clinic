import {Routes} from "@angular/router";
import * as path from "node:path";

export const orderRoutes: Routes = [
  {
    path: 'confirm-order',
    loadComponent: () => import('./page/confirm-payment-page/confirm-payment-page.component')
      .then(c => c.ConfirmPaymentPageComponent)
  },
  {
    path: 'my-order-summary',
    loadComponent: () => import('./page/order-confirmation-page/order-confirmation-page.component')
      .then(c => c.OrderConfirmationPageComponent)
  }
]
