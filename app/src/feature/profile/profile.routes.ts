import {Routes} from "@angular/router";
import {AppNode} from "@shared-routes";

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
        loadComponent: () => import('./page/edit-profile/edit-profile.component')
          .then(c => c.EditProfileComponent)
      },
      {
        path: AppNode.MY_ORDERS,
        loadComponent: () => import('./page/order-profile/order-profile.component')
          .then(c => c.OrderProfileComponent)
      }

    ]
  }
]
