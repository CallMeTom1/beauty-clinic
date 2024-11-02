
export const productRoutes = [
  {
    path:'',
    loadComponent: () => import('./page/product-page/product-page.component')
      .then(c => c.ProductPageComponent)
  },
  {
    path: ':productName',
    loadComponent: () => import('./page/product-detail-page/product-detail-page.component')
      .then(c => c.ProductDetailPageComponent)
  }
]
