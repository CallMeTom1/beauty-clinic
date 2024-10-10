
export const productRoutes = [
  {
    path:'',
    loadComponent: () => import('./page/product-page/product-page.component')
      .then(c => c.ProductPageComponent)
  }
]
