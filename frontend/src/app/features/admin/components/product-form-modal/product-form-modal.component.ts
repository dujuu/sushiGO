import { Component, effect, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Product, ProductPayload } from '../../../../core/models/product.model';
import { ImagePreviewComponent } from '../../../../shared/components/image-preview/image-preview.component';

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ImagePreviewComponent],
  template: `
    @if (open()) {
      <div class="backdrop" (click)="close.emit()">
        <form class="modal card" [formGroup]="form" (ngSubmit)="submit()" (click)="$event.stopPropagation()">
          <h3 class="display-font">{{ product() ? 'Editar producto' : 'Crear nuevo producto' }}</h3>

          <label>Nombre</label>
          <input type="text" formControlName="name" />

          <label>Descripción</label>
          <textarea rows="3" formControlName="description"></textarea>

          <label>Precio</label>
          <input type="number" min="0" formControlName="price" />

          <label>Imagen (URL)</label>
          <input type="text" formControlName="image" />

          <app-image-preview [imageUrl]="form.controls.image.value" alt="Imagen del producto" />

          <label class="check-row">
            <input type="checkbox" formControlName="is_available" />
            <span>Producto disponible</span>
          </label>

          <div class="actions">
            <button class="btn-secondary" type="button" (click)="close.emit()">Cancelar</button>
            <button class="btn-primary" type="submit" [disabled]="form.invalid || saving()">
              {{ saving() ? 'Guardando...' : 'Guardar cambios' }}
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
        background: rgba(0, 0, 0, 0.5);
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
        width: min(100%, 520px);
      }

      label {
        color: #d8d0c9;
        font-size: 0.78rem;
        font-weight: 700;
      }

      input,
      textarea {
        background: var(--surface-2);
        border: 1px solid var(--border-2);
        border-radius: 10px;
        color: var(--white);
        padding: 0.55rem 0.65rem;
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
        margin-top: 0.3rem;
      }
    `,
  ],
})
export class ProductFormModalComponent {
  readonly open = input(false);
  readonly saving = input(false);
  readonly product = input<Product | null>(null);

  readonly close = output<void>();
  readonly save = output<ProductPayload>();

  readonly form = new FormBuilder().nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    image: [''],
    is_available: [true],
  });

  constructor() {
    effect(() => {
      const product = this.product();
      if (!product) {
        this.form.reset({
          name: '',
          description: '',
          price: 0,
          image: '',
          is_available: true,
        });
        return;
      }

      this.form.reset({
        name: product.name,
        description: product.description ?? '',
        price: Number(product.price),
        image: product.image ?? '',
        is_available: product.is_available,
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
      price: Number(value.price),
      image: value.image || null,
      is_available: value.is_available,
    });
  }
}
