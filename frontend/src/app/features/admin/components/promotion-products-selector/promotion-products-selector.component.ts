import { Component, input, output, signal } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { PromotionProduct } from '../../../../core/models/promotion.model';

@Component({
  selector: 'app-promotion-products-selector',
  standalone: true,
  template: `
    <div class="selector card">
      <h4>Configurar productos de la promoción</h4>

      <div class="search-row">
        <input
          type="search"
          placeholder="Buscar producto para agregar"
          [value]="searchTerm()"
          (input)="onSearch($event)"
        />
      </div>

      <div class="catalog">
        @for (product of filteredProducts(); track product.id) {
          <button type="button" (click)="addProduct(product.id)">{{ product.name }}</button>
        }
      </div>

      <div class="selected">
        @if (selected().length === 0) {
          <p>La promoción no tiene productos asociados.</p>
        } @else {
          @for (item of selected(); track item.product_id) {
            <article>
              <span>{{ productName(item.product_id) }}</span>
              <label>
                Cantidad incluida
                <input
                  type="number"
                  min="1"
                  [value]="item.quantity"
                  (input)="updateQuantity(item.product_id, $event)"
                />
              </label>
              <button type="button" class="remove" (click)="remove(item.product_id)">Quitar</button>
            </article>
          }
        }
      </div>
    </div>
  `,
  styles: [
    `
      .selector {
        display: grid;
        gap: 0.5rem;
      }

      h4 {
        margin: 0;
      }

      .search-row input {
        background: var(--surface-2);
        border: 1px solid var(--border-2);
        border-radius: 10px;
        color: var(--white);
        padding: 0.48rem 0.6rem;
        width: 100%;
      }

      .catalog {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
      }

      .catalog button {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--border-2);
        border-radius: 999px;
        color: #ddd4cd;
        cursor: pointer;
        font-size: 0.73rem;
        padding: 0.32rem 0.6rem;
      }

      .selected {
        display: grid;
        gap: 0.45rem;
      }

      .selected p {
        color: var(--muted);
        font-size: 0.78rem;
      }

      article {
        align-items: center;
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 10px;
        display: grid;
        gap: 0.5rem;
        grid-template-columns: 1fr auto auto;
        padding: 0.5rem;
      }

      label {
        color: #d8d0c9;
        display: grid;
        font-size: 0.72rem;
      }

      input {
        background: var(--surface-3);
        border: 1px solid var(--border-2);
        border-radius: 8px;
        color: var(--white);
        margin-top: 0.2rem;
        max-width: 76px;
        padding: 0.28rem 0.35rem;
      }

      .remove {
        background: transparent;
        border: 1px solid #7e4048;
        border-radius: 8px;
        color: #f1aab5;
        cursor: pointer;
        font-size: 0.72rem;
        padding: 0.35rem 0.45rem;
      }
    `,
  ],
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
