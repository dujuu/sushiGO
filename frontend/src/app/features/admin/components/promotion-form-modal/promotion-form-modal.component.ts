import { Component, effect, input, output, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Promotion, PromotionPayload, PromotionProduct } from '../../../../core/models/promotion.model';
import { Product } from '../../../../core/models/product.model';
import { PromotionProductsSelectorComponent } from '../promotion-products-selector/promotion-products-selector.component';

@Component({
  selector: 'app-promotion-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, PromotionProductsSelectorComponent],
  template: `
    @if (open()) {
      <div class="backdrop" (click)="close.emit()">
        <form class="modal card" [formGroup]="form" (ngSubmit)="submit()" (click)="$event.stopPropagation()">
          <h3 class="display-font">{{ promotion() ? 'Editar promoción' : 'Crear promoción' }}</h3>

          <label>Nombre</label>
          <input type="text" formControlName="name" />

          <label>Descripción</label>
          <textarea rows="3" formControlName="description"></textarea>

          <label>Precio original (opcional)</label>
          <input type="number" min="0" formControlName="original_price" />

          <label>Precio promocional</label>
          <input type="number" min="0" formControlName="promo_price" />

          <label class="check-row">
            <input type="checkbox" formControlName="is_active" />
            <span>Promoción activa</span>
          </label>

          <app-promotion-products-selector
            [products]="products()"
            [selected]="selectedProducts()"
            (selectedChange)="selectedProducts.set($event)"
          />

          <div class="actions">
            <button class="btn-secondary" type="button" (click)="close.emit()">Cancelar</button>
            <button class="btn-primary" type="submit" [disabled]="form.invalid || saving()">
              {{ saving() ? 'Guardando...' : 'Guardar promoción' }}
            </button>
          </div>
        </form>
      </div>
    }
  `,
  styles: [
    `
      .backdrop {
        align-items: center;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        inset: 0;
        justify-content: center;
        padding: 1rem;
        position: fixed;
        z-index: 120;
      }

      .modal {
        display: grid;
        gap: 0.45rem;
        max-height: calc(100vh - 2rem);
        overflow: auto;
        width: min(100%, 680px);
      }

      .grid-two {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: 1fr;
      }

      @media (min-width: 768px) {
        .grid-two {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      label {
        color: #d8d0c9;
        font-size: 0.78rem;
        font-weight: 700;
      }

      input,
      select,
      textarea {
        background: var(--surface-2);
        border: 1px solid var(--border-2);
        border-radius: 10px;
        color: var(--white);
        padding: 0.55rem 0.65rem;
        width: 100%;
      }

      .check-row {
        align-items: center;
        display: flex;
        gap: 0.4rem;
      }

      .actions {
        display: flex;
        gap: 0.5rem;
        justify-content: end;
      }
    `,
  ],
})
export class PromotionFormModalComponent {
  readonly open = input(false);
  readonly saving = input(false);
  readonly promotion = input<Promotion | null>(null);
  readonly products = input<Product[]>([]);

  readonly close = output<void>();
  readonly save = output<PromotionPayload>();

  readonly selectedProducts = signal<PromotionProduct[]>([]);

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(140)]],
    description: [''],
    original_price: [0],
    promo_price: [0, [Validators.required, Validators.min(0)]],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const promotion = this.promotion();

      if (!promotion) {
        this.selectedProducts.set([]);
        this.form.reset({
          name: '',
          description: '',
          original_price: 0,
          promo_price: 0,
          is_active: true,
        });
        return;
      }

      this.selectedProducts.set(
        promotion.products.map((product) => ({
          product_id: product.id,
          quantity: product.quantity ?? 1,
        })),
      );

      this.form.reset({
        name: promotion.name,
        description: promotion.description ?? '',
        original_price: Number(promotion.original_price ?? 0),
        promo_price: Number(promotion.promo_price),
        is_active: promotion.is_active,
      });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.save.emit({
      name: value.name,
      description: value.description || null,
      original_price: value.original_price > 0 ? Number(value.original_price) : null,
      promo_price: Number(value.promo_price),
      is_active: value.is_active,
      products: this.selectedProducts(),
    });
  }
}
