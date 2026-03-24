import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CatalogService } from '../../catalog/services/catalog.service';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-promotions-page',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, ImageFallbackDirective],
  template: `
    <h1>Promociones</h1>
    @if (promotions$ | async; as promotions) {
      @if (promotions.length > 0) {
        <div class="grid">
          @for (product of promotions; track product.id) {
            <article class="card">
              <img [src]="product.imageUrl" [alt]="product.name" appImageFallback />
              <h2>{{ product.name }}</h2>
              <p>{{ product.description }}</p>
              <div class="prices">
                @if (product.originalPrice) {
                  <small>{{ product.originalPrice | currency : 'CLP' : 'symbol' : '1.0-0' }}</small>
                }
                <strong>{{ product.price | currency : 'CLP' : 'symbol' : '1.0-0' }}</strong>
              </div>
            </article>
          }
        </div>
      } @else {
        <article class="card">
          <p>No hay promociones activas por ahora.</p>
        </article>
      }
    }
  `,
  styles: [
    '.grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }',
    '.prices { display: grid; gap: 0.1rem; }',
    'small { color: #b3a79e; text-decoration: line-through; }',
    'img { width: 100%; border-radius: 12px; margin-bottom: 0.7rem; aspect-ratio: 16 / 10; object-fit: cover; }',
  ],
})
export class PromotionsPageComponent {
  private readonly catalogService = inject(CatalogService);

  readonly promotions$ = this.catalogService.getPromotions();
}
