import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Product, ProductPayload } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { ProductFormModalComponent } from '../components/product-form-modal/product-form-modal.component';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    PageHeaderComponent,
    SearchBarComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    ConfirmModalComponent,
    ProductFormModalComponent,
  ],
  template: `
    <app-page-header title="Gestión de productos" subtitle="Crea, edita y controla disponibilidad.">
      <button class="btn-primary" type="button" (click)="openCreate()">Nuevo producto</button>
    </app-page-header>

    <section class="toolbar card">
      <app-search-bar [value]="search()" placeholder="Buscar por nombre" (valueChange)="search.set($event)" />
      <label>
        <input type="checkbox" [checked]="showOnlyAvailable()" (change)="toggleOnlyAvailable($event)" />
        Solo disponibles
      </label>
    </section>

    @if (filteredProducts().length === 0) {
      <app-empty-state title="Sin productos" description="No encontramos productos con estos filtros." />
    } @else {
      <section class="grid">
        @for (product of filteredProducts(); track product.id) {
          <article class="card product-card">
            <div class="head">
              <h3>{{ product.name }}</h3>
              <app-status-badge [label]="product.is_available ? 'Activa' : 'Inactiva'" />
            </div>
            <p>{{ product.description || 'Sin descripción.' }}</p>
            <strong>{{ product.price | currency: 'PEN' : 'symbol-narrow' }}</strong>

            <div class="actions">
              <button class="btn-secondary" type="button" (click)="openEdit(product)">Editar</button>
              <button class="btn-secondary" type="button" (click)="toggleAvailability(product)">
                {{ product.is_available ? 'Desactivar' : 'Activar' }}
              </button>
              <button class="btn-secondary" type="button" (click)="openDelete(product)">Eliminar</button>
            </div>
          </article>
        }
      </section>
    }

    <app-product-form-modal
      [open]="showFormModal()"
      [saving]="saving()"
      [product]="editingProduct()"
      (close)="closeForm()"
      (save)="submitProduct($event)"
    />

    <app-confirm-modal
      [open]="showDeleteModal()"
      title="Eliminar producto"
      description="Esta acción no se puede deshacer."
      (close)="showDeleteModal.set(false)"
      (confirm)="confirmDelete()"
    />
  `,
  styles: [
    `
      .toolbar {
        align-items: stretch;
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
        margin-bottom: 0.8rem;
      }

      .toolbar label {
        align-items: center;
        color: #d8d0c9;
        display: flex;
        font-size: 0.8rem;
        gap: 0.4rem;
      }

      .grid {
        display: grid;
        gap: 0.7rem;
        grid-template-columns: 1fr;
      }

      .product-card {
        display: grid;
        gap: 0.45rem;
      }

      .head {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      h3,
      p {
        margin: 0;
      }

      p {
        color: var(--muted);
        font-size: 0.83rem;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
      }

      @media (min-width: 768px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .toolbar {
          align-items: center;
          flex-direction: row;
          justify-content: space-between;
        }
      }
    `,
  ],
})
export class AdminProductsPageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly notificationService = inject(NotificationService);

  readonly products = signal<Product[]>([]);
  readonly search = signal('');
  readonly showOnlyAvailable = signal(false);
  readonly saving = signal(false);

  readonly showFormModal = signal(false);
  readonly editingProduct = signal<Product | null>(null);

  readonly showDeleteModal = signal(false);
  readonly deletingProduct = signal<Product | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  filteredProducts(): Product[] {
    const term = this.search().toLowerCase().trim();

    return this.products().filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(term);
      const matchesAvailability = this.showOnlyAvailable() ? product.is_available : true;
      return matchesSearch && matchesAvailability;
    });
  }

  loadProducts(): void {
    this.productService.getProducts({ per_page: 100 }).subscribe((response) => {
      this.products.set(response.data);
    });
  }

  toggleOnlyAvailable(event: Event): void {
    this.showOnlyAvailable.set((event.target as HTMLInputElement).checked);
  }

  openCreate(): void {
    this.editingProduct.set(null);
    this.showFormModal.set(true);
  }

  openEdit(product: Product): void {
    this.editingProduct.set(product);
    this.showFormModal.set(true);
  }

  closeForm(): void {
    this.showFormModal.set(false);
  }

  submitProduct(payload: ProductPayload): void {
    this.saving.set(true);

    const editing = this.editingProduct();
    const request$ = editing
      ? this.productService.updateProduct(editing.id, payload)
      : this.productService.createProduct(payload);

    request$.subscribe({
      next: () => {
        this.notificationService.success(editing ? 'Producto actualizado.' : 'Producto creado.');
        this.saving.set(false);
        this.showFormModal.set(false);
        this.loadProducts();
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  toggleAvailability(product: Product): void {
    this.productService.toggleAvailability(product.id, !product.is_available).subscribe((updated) => {
      this.products.set(this.products().map((item) => (item.id === updated.id ? updated : item)));
      this.notificationService.info('Disponibilidad actualizada.');
    });
  }

  openDelete(product: Product): void {
    this.deletingProduct.set(product);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const product = this.deletingProduct();
    if (!product) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe(() => {
      this.notificationService.warning('Producto eliminado.');
      this.showDeleteModal.set(false);
      this.deletingProduct.set(null);
      this.loadProducts();
    });
  }
}
