import {Routes} from "@angular/router";
import {AppNode} from "@shared-routes";

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./router/admin-router/admin-router.component')
      .then(c => c.AdminRouterComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./page/admin-dashboard/admin-dashboard.component')
          .then(c => c.AdminDashboardComponent),
      },
      {
        path: AppNode.CARE,
        loadComponent: () => import('./page/manage-care-page/manage-care-page.component')
          .then(c => c.ManageCarePageComponent),
      },
      {
        path: AppNode.APPOINTMENT,
        loadComponent: () => import('./page/manage-appointment-page/manage-appointment-page.component')
          .then(c => c.ManageAppointmentPageComponent),
      },
      {
        path: AppNode.BUSINESS_HOURS,
        loadComponent: () => import('./page/manage-business-hours-page/manage-business-hours-page.component')
          .then(c => c.ManageBusinessHoursPageComponent),
      },
      {
        path: AppNode.HOLIDAY,
        loadComponent: () => import('./page/manage-holiday-page/manage-holiday-page.component')
          .then(c => c.ManageHolidayPageComponent),
      },
      {
        path: AppNode.FALL_BACK,
        loadComponent: () => import('./page/admin-fall-back-page/admin-fall-back-page.component')
          .then(c=> c.AdminFallBackPageComponent),
        pathMatch:'full'
      }
    ]
  }
]
