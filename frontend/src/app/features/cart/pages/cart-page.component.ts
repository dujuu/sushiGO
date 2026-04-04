import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BusinessSettingsService } from '../../../core/services/business-settings.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent {
  readonly cartService = inject(CartService);
  readonly settingsService = inject(BusinessSettingsService);
  readonly freeDeliveryGoal = 25000;
  readonly subtotal = computed(() => this.cartService.total());
  readonly shippingCost = computed(() =>
    this.cartService.itemCount() > 0 ? this.settingsService.settings().deliveryFee : 0,
  );
  readonly finalTotal = computed(() => this.subtotal() + this.shippingCost());
  readonly remainingForFreeDelivery = computed(() =>
    Math.max(this.freeDeliveryGoal - this.cartService.total(), 0),
  );
  readonly freeDeliveryProgress = computed(() =>
    Math.min((this.cartService.total() / this.freeDeliveryGoal) * 100, 100),
  );

  increase(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity + 1);
  }

  decrease(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, Math.max(1, quantity - 1));
  }
}
