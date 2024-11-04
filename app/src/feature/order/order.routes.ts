import {Routes} from "@angular/router";
import {AppRoutes} from "@shared-routes";

export const orderRoutes: Routes = [
  {
    path: AppRoutes.CART_ORDER_CONFIRM,
    loadComponent: () => import('./page/confirm-payment-page/confirm-payment-page.component')
      .then(c => c.ConfirmPaymentPageComponent)
  },
  {
    path: AppRoutes.CART_ORDER_SUMMARY,
    loadComponent: () => import('./page/order-confirmation-page/order-confirmation-page.component')
      .then(c => c.OrderConfirmationPageComponent)
  }
]
