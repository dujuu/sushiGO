import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ProductService } from '../../../core/services/product.service';
import { PromotionService } from '../../../core/services/promotion.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [PageHeaderComponent, StatCardComponent],
  template: `
    <app-page-header
      title="Panel administrativo"
      subtitle="Control rápido de catálogo, promociones y respaldo de pedidos"
    />

    <section class="stats">
      <app-stat-card label="Productos totales" [value]="totalProducts()" />
      <app-stat-card label="Productos disponibles" [value]="availableProducts()" />
      <app-stat-card label="Productos ocultos/sin stock" [value]="unavailableProducts()" />
      <app-stat-card label="Promociones activas" [value]="activePromotions()" />
      <app-stat-card label="Promociones inactivas" [value]="inactivePromotions()" />
      <app-stat-card label="Pedidos respaldo" [value]="totalOrders()" />
      <app-stat-card label="Pedidos de hoy" [value]="todayOrders()" />
    </section>
  `,
  styles: [
    `
      .stats {
        display: grid;
        gap: 0.7rem;
        grid-template-columns: 1fr;
      }

      @media (min-width: 480px) {
        .stats {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (min-width: 1024px) {
        .stats {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    `,
  ],
})
export class AdminDashboardPageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly promotionService = inject(PromotionService);
  private readonly orderService = inject(OrderService);

  readonly totalProducts = signal(0);
  readonly availableProducts = signal(0);
  readonly unavailableProducts = signal(0);
  readonly activePromotions = signal(0);
  readonly inactivePromotions = signal(0);
  readonly totalOrders = signal(0);
  readonly todayOrders = signal(0);

  ngOnInit(): void {
    forkJoin({
      products: this.productService.getProducts({ per_page: 100 }),
      promotions: this.promotionService.getPromotions({ per_page: 100 }),
      orders: this.orderService.getOrders({ per_page: 200 }),
    }).subscribe(({ products, promotions, orders }) => {
      this.totalProducts.set(products.total);
      this.availableProducts.set(products.data.filter((product) => product.is_available).length);
      this.unavailableProducts.set(products.data.filter((product) => !product.is_available).length);

      const activePromotions = promotions.data.filter((promotion) => promotion.is_active).length;
      this.activePromotions.set(activePromotions);
      this.inactivePromotions.set(Math.max(promotions.total - activePromotions, 0));

      this.totalOrders.set(orders.total);
      const today = new Date().toDateString();
      this.todayOrders.set(
        orders.data.filter((order) => new Date(order.created_at).toDateString() === today).length,
      );
    });
  }
}
