import {Routes} from "@angular/router";

export const orderRoutes: Routes = [
  {
    path: 'confirmation',
    loadComponent: () => import('./page/confirm-payment-page/confirm-payment-page.component')
      .then(c => c.ConfirmPaymentPageComponent)
  },
  {
    path: 'recapitulatif',
    loadComponent: () => import('./page/order-confirmation-page/order-confirmation-page.component')
      .then(c => c.OrderConfirmationPageComponent)
  }
]
