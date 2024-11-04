import {Routes} from "@angular/router";
import {CanSignGuard} from "./guard";
import {AppNode, AppRoutes} from "@shared-routes";

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
    path: AppNode.RESET_PASSWORD,
    loadComponent: () => import('./component/reset-password/reset-password.component')
      .then(c => c.ResetPasswordComponent),
  },
  {
    path:AppNode.FORGOT_PASSWORD,
    loadComponent: () => import('./page/forgot-password-page/forgot-password-page.component')
      .then(c => c.ForgotPasswordPageComponent)
  },
  {
    path: '**',
    loadComponent: () => import('../home/page/home-page/home-page.component')
      .then(c => c.HomePageComponent),
  }
];
