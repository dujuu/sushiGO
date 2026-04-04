import { Component, input, output, signal } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { PromotionProduct } from '../../../../core/models/promotion.model';

@Component({
  selector: 'app-promotion-products-selector',
  standalone: true,
  templateUrl: './promotion-products-selector.component.html',
  styleUrls: ['./promotion-products-selector.component.css'],
})
export class PromotionProductsSelectorComponent {
  readonly products = input.required<Product[]>();
  readonly selected = input.required<PromotionProduct[]>();

  readonly selectedChange = output<PromotionProduct[]>();

  readonly searchTerm = signal('');

  filteredProducts(): Product[] {
    const term = this.searchTerm().toLowerCase().trim();

    return this.products().filter(
      (product) =>
        product.name.toLowerCase().includes(term) &&
        !this.selected().some((item) => item.product_id === product.id),
    );
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  addProduct(productId: number): void {
    this.selectedChange.emit([...this.selected(), { product_id: productId, quantity: 1 }]);
  }

  updateQuantity(productId: number, event: Event): void {
    const quantity = Math.max(1, Number((event.target as HTMLInputElement).value || 1));
    this.selectedChange.emit(
      this.selected().map((item) => (item.product_id === productId ? { ...item, quantity } : item)),
    );
  }

  remove(productId: number): void {
    this.selectedChange.emit(this.selected().filter((item) => item.product_id !== productId));
  }

  productName(productId: number): string {
    return this.products().find((product) => product.id === productId)?.name ?? 'Producto';
  }
}
