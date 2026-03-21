import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { Promotion, PromotionPayload, PromotionProduct } from '../../../core/models/promotion.model';
import { ProductService } from '../../../core/services/product.service';
import { PromotionService } from '../../../core/services/promotion.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { PromotionFormModalComponent } from '../components/promotion-form-modal/promotion-form-modal.component';

@Component({
  selector: 'app-admin-promotions-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    PageHeaderComponent,
    SearchBarComponent,
    EmptyStateComponent,
    StatusBadgeComponent,
    ConfirmModalComponent,
    PromotionFormModalComponent,
  ],
  template: `
    <app-page-header title="Gestión de promociones" subtitle="Administra combos y ofertas activas.">
      <button class="btn-primary" type="button" (click)="openCreate()">Nueva promoción</button>
    </app-page-header>

    <section class="toolbar card">
      <app-search-bar [value]="search()" placeholder="Buscar por nombre" (valueChange)="search.set($event)" />
      <label>
        <input type="checkbox" [checked]="showOnlyActive()" (change)="toggleOnlyActive($event)" />
        Solo activas
      </label>
    </section>

    @if (filteredPromotions().length === 0) {
      <app-empty-state title="Sin promociones" description="No encontramos promociones con estos filtros." />
    } @else {
      <section class="grid">
        @for (promotion of filteredPromotions(); track promotion.id) {
          <article class="card promo-card">
            <div class="head">
              <h3>{{ promotion.name }}</h3>
              <app-status-badge [label]="promotion.is_active ? 'Activa' : 'Inactiva'" />
            </div>
            <p>{{ promotion.description || 'Sin descripción.' }}</p>
            <div class="price-row">
              @if (promotion.original_price) {
                <span class="old-price">{{ promotion.original_price | currency: 'PEN' : 'symbol-narrow' }}</span>
              }
              <strong>{{ promotion.promo_price | currency: 'PEN' : 'symbol-narrow' }}</strong>
            </div>

            <small>{{ promotion.products.length }} producto(s) asociados</small>

            <div class="actions">
              <button class="btn-secondary" type="button" (click)="openEdit(promotion)">Editar</button>
              <button class="btn-secondary" type="button" (click)="toggleStatus(promotion)">
                {{ promotion.is_active ? 'Desactivar' : 'Activar' }}
              </button>
              <button class="btn-secondary" type="button" (click)="openDelete(promotion)">Eliminar</button>
            </div>
          </article>
        }
      </section>
    }

    <app-promotion-form-modal
      [open]="showFormModal()"
      [saving]="saving()"
      [promotion]="editingPromotion()"
      [products]="products()"
      (close)="closeForm()"
      (save)="submitPromotion($event)"
    />

    <app-confirm-modal
      [open]="showDeleteModal()"
      title="Eliminar promoción"
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

      .promo-card {
        display: grid;
        gap: 0.45rem;
      }

      .head {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      h3,
      p,
      small {
        margin: 0;
      }

      p,
      small {
        color: var(--muted);
        font-size: 0.83rem;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
      }

      .price-row {
        align-items: baseline;
        display: flex;
        gap: 0.4rem;
      }

      .old-price {
        color: #b3a9a0;
        font-size: 0.84rem;
        text-decoration: line-through;
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
export class AdminPromotionsPageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly promotionService = inject(PromotionService);
  private readonly notificationService = inject(NotificationService);

  readonly promotions = signal<Promotion[]>([]);
  readonly products = signal<Product[]>([]);

  readonly search = signal('');
  readonly showOnlyActive = signal(false);
  readonly saving = signal(false);

  readonly showFormModal = signal(false);
  readonly editingPromotion = signal<Promotion | null>(null);

  readonly showDeleteModal = signal(false);
  readonly deletingPromotion = signal<Promotion | null>(null);

  ngOnInit(): void {
    this.loadPromotions();
    this.loadProducts();
  }

  filteredPromotions(): Promotion[] {
    const term = this.search().toLowerCase().trim();

    return this.promotions().filter((promotion) => {
      const matchesSearch = promotion.name.toLowerCase().includes(term);
      const matchesActive = this.showOnlyActive() ? promotion.is_active : true;
      return matchesSearch && matchesActive;
    });
  }

  loadPromotions(): void {
    this.promotionService.getPromotions({ per_page: 100 }).subscribe((response) => {
      this.promotions.set(response.data);
    });
  }

  loadProducts(): void {
    this.productService.getProducts({ per_page: 100 }).subscribe((response) => {
      this.products.set(response.data);
    });
  }

  toggleOnlyActive(event: Event): void {
    this.showOnlyActive.set((event.target as HTMLInputElement).checked);
  }

  openCreate(): void {
    this.editingPromotion.set(null);
    this.showFormModal.set(true);
  }

  openEdit(promotion: Promotion): void {
    this.editingPromotion.set(promotion);
    this.showFormModal.set(true);
  }

  closeForm(): void {
    this.showFormModal.set(false);
  }

  submitPromotion(payload: PromotionPayload): void {
    this.saving.set(true);

    const editing = this.editingPromotion();

    const request$ = editing
      ? this.promotionService.updatePromotion(editing.id, payload)
      : this.promotionService.createPromotion(payload);

    request$.subscribe({
      next: (promotion) => {
        const productsPayload: PromotionProduct[] = payload.products ?? [];

        this.promotionService.syncProducts(promotion.id, productsPayload).subscribe({
          next: () => {
            this.notificationService.success(editing ? 'Promoción actualizada.' : 'Promoción creada.');
            this.saving.set(false);
            this.showFormModal.set(false);
            this.loadPromotions();
          },
          error: () => {
            this.saving.set(false);
          },
        });
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  toggleStatus(promotion: Promotion): void {
    this.promotionService.toggleStatus(promotion.id, !promotion.is_active).subscribe((updated) => {
      this.promotions.set(this.promotions().map((item) => (item.id === updated.id ? updated : item)));
      this.notificationService.info('Estado de promoción actualizado.');
    });
  }

  openDelete(promotion: Promotion): void {
    this.deletingPromotion.set(promotion);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const promotion = this.deletingPromotion();
    if (!promotion) {
      return;
    }

    this.promotionService.deletePromotion(promotion.id).subscribe(() => {
      this.notificationService.warning('Promoción eliminada.');
      this.showDeleteModal.set(false);
      this.deletingPromotion.set(null);
      this.loadPromotions();
    });
  }
}
