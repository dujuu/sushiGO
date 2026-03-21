import { Routes } from '@angular/router';
import { adminGuestGuard } from './core/guards/admin-guest.guard';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
	{
		path: 'admin/login',
		canActivate: [adminGuestGuard],
		loadComponent: () =>
			import('./features/admin/pages/admin-login-page.component').then(
				(m) => m.AdminLoginPageComponent,
			),
	},
	{
		path: 'admin',
		canActivate: [adminAuthGuard],
		loadChildren: () =>
			import('./features/admin/admin.routes').then((m) => m.adminRoutes),
	},
	{
		path: '',
		loadComponent: () =>
			import('./layout/shell/shell.component').then((m) => m.ShellComponent),
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'catalog',
			},
			{
				path: 'catalog',
				loadComponent: () =>
					import('./features/catalog/pages/catalog-page.component').then(
						(m) => m.CatalogPageComponent,
					),
			},
			{
				path: 'catalog/:id',
				loadComponent: () =>
					import('./features/catalog/pages/product-detail-page.component').then(
						(m) => m.ProductDetailPageComponent,
					),
			},
			{
				path: 'promotions',
				loadComponent: () =>
					import('./features/promotions/pages/promotions-page.component').then(
						(m) => m.PromotionsPageComponent,
					),
			},
			{
				path: 'cart',
				loadComponent: () =>
					import('./features/cart/pages/cart-page.component').then(
						(m) => m.CartPageComponent,
					),
			},
			{
				path: 'checkout',
				loadComponent: () =>
					import('./features/checkout/pages/checkout-page.component').then(
						(m) => m.CheckoutPageComponent,
					),
			},
			{
				path: 'orders/:id/status',
				loadComponent: () =>
					import('./features/orders/pages/order-status-page.component').then(
						(m) => m.OrderStatusPageComponent,
					),
			},
		],
	},
	{
		path: '**',
		redirectTo: 'catalog',
	},
];
