import { Injectable, computed, signal } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { Product } from '../../../shared/models/catalog.model';
import { CartItem } from '../../../shared/models/cart.model';

const CART_KEY = 'sushi_cart_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>([]);

  readonly items = computed(() => this.itemsSignal());
  readonly itemCount = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0),
  );
  readonly total = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.subtotal, 0),
  );

  constructor(private readonly storage: StorageService) {
    const persisted = this.storage.get<CartItem[]>(CART_KEY, []);
    this.itemsSignal.set(persisted);
  }

  add(product: Product): void {
    const current = [...this.itemsSignal()];
    const existing = current.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity += 1;
      existing.subtotal = existing.quantity * existing.product.price;
    } else {
      current.push({
        product,
        quantity: 1,
        subtotal: product.price,
      });
    }

    this.itemsSignal.set(current);
    this.persist();
  }

  updateQuantity(productId: number, quantity: number): void {
    const normalizedQuantity = Math.max(1, quantity);
    const current = this.itemsSignal().map((item) =>
      item.product.id === productId
        ? {
            ...item,
            quantity: normalizedQuantity,
            subtotal: normalizedQuantity * item.product.price,
          }
        : item,
    );

    this.itemsSignal.set(current);
    this.persist();
  }

  remove(productId: number): void {
    this.itemsSignal.set(
      this.itemsSignal().filter((item) => item.product.id !== productId),
    );
    this.persist();
  }

  clear(): void {
    this.itemsSignal.set([]);
    this.persist();
  }

  private persist(): void {
    this.storage.set(CART_KEY, this.itemsSignal());
  }
}
