import {Routes} from "@angular/router";
import {AppNode} from "@shared-routes";
import {ProfileComponent} from "./component/profile";

export const ProfileRoutes: Routes = [
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
        path: AppNode.EDIT_PROFILE,
        loadComponent: () => import('./component/profile/profile.component')
          .then(c => c.ProfileComponent)
      },
      {
        path: AppNode.EDIT_ADDRESS,
        loadComponent: () => import('./component/address-book/address-book.component')
          .then(c => c.AddressBookComponent),
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
