import { Component, effect, input, output, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Promotion, PromotionPayload, PromotionProduct } from '../../../../core/models/promotion.model';
import { Product } from '../../../../core/models/product.model';
import { PromotionProductsSelectorComponent } from '../promotion-products-selector/promotion-products-selector.component';

@Component({
  selector: 'app-promotion-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, PromotionProductsSelectorComponent],
  templateUrl: './promotion-form-modal.component.html',
  styleUrls: ['./promotion-form-modal.component.css'],
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
