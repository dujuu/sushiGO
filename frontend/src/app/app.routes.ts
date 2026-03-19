import { Routes } from '@angular/router';

export const routes: Routes = [
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
