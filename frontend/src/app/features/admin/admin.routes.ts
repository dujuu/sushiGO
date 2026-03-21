import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin-dashboard-page.component').then(
            (m) => m.AdminDashboardPageComponent,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/admin-products-page.component').then(
            (m) => m.AdminProductsPageComponent,
          ),
      },
      {
        path: 'promotions',
        loadComponent: () =>
          import('./pages/admin-promotions-page.component').then(
            (m) => m.AdminPromotionsPageComponent,
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/admin-orders-page.component').then(
            (m) => m.AdminOrdersPageComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/admin-settings-page.component').then(
            (m) => m.AdminSettingsPageComponent,
          ),
      },
    ],
  },
];
