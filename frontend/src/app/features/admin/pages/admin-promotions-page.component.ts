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
  templateUrl: './admin-promotions-page.component.html',
  styleUrls: ['./admin-promotions-page.component.css'],
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
