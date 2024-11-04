import {Routes} from "@angular/router";
import {AppNode, AppRoutes} from "@shared-routes";

export const profileRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./router/profile-router/profile-router.component')
      .then(c => c.ProfileRouterComponent),
    children: [
      {
        path:'',
        loadComponent: () => import('./page/profile-page/profile-page.component')
          .then(c => c.ProfilePageComponent),
      },
      {
        path: AppNode.INFO,
        loadComponent: () => import('./component/profile/profile.component')
          .then(c => c.ProfileComponent)
      },
      {
        path:  AppNode.ADDRESS_BOOK,
        loadComponent: () => import('./component/address-book/address-book.component')
          .then(c => c.AddressBookComponent),
      },
      {
        path: AppNode.WISHLIST,
        loadComponent: () => import('./component/wishlist-list/wishlist-list.component')
          .then(c => c.WishlistListComponent),
      },
      {
        path: AppNode.ORDER,
        loadComponent: () => import('./component/order-list/order-list.component')
          .then(c => c.OrderListComponent),
      },
      {
        path: AppNode.MY_APPOINTMENT,
        loadComponent: () => import('./component/appointment-list/appointment-list.component')
          .then(c => c.AppointmentListComponent),
      },
      {
        path: AppNode.TRACK_ORDERS,
        loadComponent: () => import('./component/track-order/track-order.component')
          .then(c => c.TrackOrderComponent),
      },
      {
        path: AppNode.MY_ORDERS,
        loadComponent: () => import('./page/order-profile/order-profile.component')
          .then(c => c.OrderProfileComponent)
      }

    ]
  }
]
