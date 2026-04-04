import { Component, effect, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Product, ProductPayload } from '../../../../core/models/product.model';
import { ImagePreviewComponent } from '../../../../shared/components/image-preview/image-preview.component';

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ImagePreviewComponent],
  templateUrl: './product-form-modal.component.html',
  styleUrls: ['./product-form-modal.component.css'],
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
