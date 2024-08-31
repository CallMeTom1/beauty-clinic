import {Routes} from "@angular/router";
import {AppNode} from "@shared-routes";

export const careRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page/care-page/care-page.component')
      .then(c => c.CarePageComponent),
  },
  {
    path:AppNode.EPIL_LASER,
    loadComponent: () => import('./page/epil-laser-page/epil-laser-page.component')
      .then(c => c.EpilLaserPageComponent)
  }
]
