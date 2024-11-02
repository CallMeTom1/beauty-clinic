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
        path: AppNode.CATEGORY_PRODUCT,
        loadComponent: () => import('./page/admin-product-category-page/admin-product-category-page.component')
          .then(c => c.AdminProductCategoryPageComponent),
      },
      {
        path: AppNode.PRODUCT,
        loadComponent: () => import('./page/admin-product-page/admin-product-page.component')
          .then(c => c.AdminProductPageComponent),
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
        path: AppNode.ORDER,
        loadComponent: () => import('./page/manage-order-page/manage-order-page.component')
          .then(c => c.ManageOrderPageComponent),
      },
      {
        path: AppNode.CLINIC,
        loadComponent: () => import('./page/manage-clinic-page/manage-clinic-page.component')
          .then(c => c.ManageClinicPageComponent),
      },
      {
        path: AppNode.BUSINESS_HOURS,
        loadComponent: () => import('./page/manage-business-hours-page/manage-business-hours-page.component')
          .then(c => c.ManageBusinessHoursPageComponent),
      },
      {
        path: AppNode.CUSTOMER,
        loadComponent: () => import('./page/manage-customer-page/manage-customer-page.component')
          .then(c => c.ManageCustomerPageComponent),
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
