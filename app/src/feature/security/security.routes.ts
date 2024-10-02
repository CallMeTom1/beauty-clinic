import {Routes} from "@angular/router";
import {CanSignGuard, WalletGuard} from "./guard";
import {AppNode} from "@shared-routes";
import {ProfileAndWalletGuard} from "./guard";

export const securityRoutes: Routes = [
  {
    path: AppNode.SIGNIN,
    loadComponent: () => import('./page/sign-in-page/sign-in-page.component')
      .then(c => c.SignInPageComponent),
    canActivate: [CanSignGuard()]
  },
  {
    path: AppNode.SIGNUP,
    loadComponent: () => import('./page/sign-up-page/sign-up-page.component')
      .then(c => c.SignUpPageComponent),
    //canActivate: [CanSignGuard()]

  },
  {
    path: AppNode.PROFILE,
    loadComponent: () => import('./page/profile-page/profile-page.component')
      .then(c => c.ProfilePageComponent),
    canActivate: [ProfileAndWalletGuard()]
  },
  {
    path: ':token',
    loadComponent: () => import('./page/reset-password-page/reset-password-page.component')
      .then(c => c.ResetPasswordPageComponent),
  },
  {
    path:'forgot-password',
    loadComponent: () => import('./page/forgot-password-page/forgot-password-page.component')
      .then(c => c.ForgotPasswordPageComponent)
  },
  {
    path: '**',
    loadComponent: () => import('../home/page/home-page/home-page.component')
      .then(c => c.HomePageComponent),
  }
];
