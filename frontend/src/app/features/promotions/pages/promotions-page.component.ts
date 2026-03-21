import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CatalogService } from '../../catalog/services/catalog.service';

@Component({
  selector: 'app-promotions-page',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe],
  template: `
    <h1>Promociones</h1>
    <div class="grid">
      @for (product of promotions$ | async; track product.id) {
        <article class="card">
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
  `,
  styles: [
    '.grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }',
    '.prices { display: grid; gap: 0.1rem; }',
    'small { color: #b3a79e; text-decoration: line-through; }',
  ],
})
export class PromotionsPageComponent {
  private readonly catalogService = inject(CatalogService);

  readonly promotions$ = this.catalogService.getPromotions();
}
