import {Routes} from "@angular/router";
import {AppNode, AppRoutes} from "@shared-routes";

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./router/admin-router/admin-router.component')
      .then(c => c.AdminRouterComponent),
    children: [
      {
        path: AppNode.DASHBOARD,
        loadComponent: () => import('./page/admin-dashboard/admin-dashboard.component')
          .then(c => c.AdminDashboardComponent),
      },
      {
        path: AppNode.MANAGE_PRODUCT,
        loadComponent: () => import('./page/admin-product-page/admin-product-page.component')
          .then(c => c.AdminProductPageComponent),
      },
      {
        path: AppNode.MANAGE_CARE,
        loadComponent: () => import('./page/manage-care-page/manage-care-page.component')
          .then(c => c.ManageCarePageComponent),
      },
      {
        path: AppNode.MANAGE_APPOINTMENT,
        loadComponent: () => import('./page/manage-appointment-page/manage-appointment-page.component')
          .then(c => c.ManageAppointmentPageComponent),
      },
      {
        path: AppNode.MANAGE_ORDER,
        loadComponent: () => import('./page/manage-order-page/manage-order-page.component')
          .then(c => c.ManageOrderPageComponent),
      },
      {
        path: AppNode.MANAGE_CLINIC,
        loadComponent: () => import('./page/manage-clinic-page/manage-clinic-page.component')
          .then(c => c.ManageClinicPageComponent),
      },
      {
        path: AppNode.MANAGE_CUSTOMER,
        loadComponent: () => import('./page/manage-customer-page/manage-customer-page.component')
          .then(c => c.ManageCustomerPageComponent),
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
