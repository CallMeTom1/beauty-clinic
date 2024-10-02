import { Routes } from "@angular/router";
import {AppNode} from "@shared-routes";
import {AdminGuard} from "./admin-role.guard";

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
        path: 'test',
        loadComponent: () => import('./page/test-page/test-page.component')
          .then(c => c.TestPageComponent),
      },
      {
        path: AppNode.CARE,
        loadChildren: () => import('../care/care.routes')
          .then(m => m.careRoutes),
      },
      {
        path: AppNode.CONTACT,
        loadComponent: () => import('../contact/page/contact-page/contact-page.component')
          .then(c => c.ContactPageComponent),
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
