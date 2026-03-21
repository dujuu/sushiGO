import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { CatalogService } from '../services/catalog.service';
import { CartService } from '../../cart/services/cart.service';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe],
  template: `
    @if (product$ | async; as product) {
      <article class="card">
        <img [src]="product.imageUrl" [alt]="product.name" />
        <h1>{{ product.name }}</h1>
        <p>{{ product.description }}</p>
        <p><strong>Ingredientes:</strong> {{ product.ingredients.join(', ') }}</p>
        <p><strong>{{ product.price | currency : 'PEN' : 'symbol' : '1.0-0' }}</strong></p>
        <button class="btn-primary" (click)="add(product)">Agregar al carrito</button>
      </article>
    }
  `,
  styles: [
    `img { width: 100%; max-width: 420px; border-radius: 12px; margin-bottom: 1rem; }`,
  ],
})
export class ProductDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogService = inject(CatalogService);
  private readonly cartService = inject(CartService);

  readonly product$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
    switchMap((id) => this.catalogService.getProductById(id)),
  );

  add(product: Parameters<CartService['add']>[0]): void {
    this.cartService.add(product);
  }
}
