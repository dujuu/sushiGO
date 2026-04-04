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
  templateUrl: './admin-dashboard-page.component.html',
  styleUrls: ['./admin-dashboard-page.component.css'],
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
