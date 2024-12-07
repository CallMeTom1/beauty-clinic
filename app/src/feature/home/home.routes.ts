import {Routes} from "@angular/router";
import {AppNode, AppRoutes} from "@shared-routes";

export const homeRoutes: Routes = [
  {
    path: AppNode.HOME,
    loadComponent: () => import('./router/home-router/home-router.component')
      .then(c => c.HomeRouterComponent),
    children: [
      {
        path: AppNode.HOME,
        loadComponent: () => import('./page/home-page/home-page.component')
          .then(c => c.HomePageComponent),
      },
      {
        path: AppRoutes.CARES,
        loadComponent: () => import('../care/page/care-page/care-page.component')
          .then(c => c.CarePageComponent),
      },
      {
        path: AppNode.PROFILE,
        loadChildren: () => import('../profile/profile.routes').then(m => m.profileRoutes)
      },
      {
        path: AppRoutes.PRODUCTS,
        loadChildren: () => import('../product/product.routes')
          .then(m => m.productRoutes),
      },
      {
        path: AppNode.ACCOUNT,
        loadChildren: () => import('../security/security.routes').then(m => m.securityRoutes)
      },
      {
        path: AppNode.FALL_BACK,
        loadComponent: () => import('../security/page/security-fall-back-page/security-fall-back-page.component')
          .then(c=> c.SecurityFallBackPageComponent),
        pathMatch:'full'
      }
    ]
  }
];
