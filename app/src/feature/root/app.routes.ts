import {Routes} from "@angular/router";
import {AppNode} from "@shared-routes";


export const routes: Routes = [

  {
    path: AppNode.ADMIN,
    loadChildren: () => import ('../admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: '',
    loadChildren: () => import('../home/home.routes').then(m => m.homeRoutes)
  }
]
