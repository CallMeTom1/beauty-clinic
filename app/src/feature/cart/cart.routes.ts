import {Routes} from "@angular/router";
import {AppNode} from "@shared-routes";

export const cartRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./cart-router/cart-router.component')
      .then(r => r.CartRouterComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./page/cart-page/cart-page.component')
          .then(c => c.CartPageComponent)
      },
      {
        path: 'order',
        loadChildren: () => import('../order/order.routes')
          .then(r => r.orderRoutes)
      }
    ]
  }
]
