import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { CatalogService } from '../../catalog/services/catalog.service';

@Component({
  selector: 'app-promotions-page',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <h1>Promociones</h1>
    <div class="grid">
      @for (product of promotions$ | async; track product.id) {
        <article class="card">
          <h2>{{ product.name }}</h2>
          <p>{{ product.description }}</p>
          <p><strong>Promo activa</strong></p>
        </article>
      }
    </div>
  `,
  styles: ['.grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }'],
})
export class PromotionsPageComponent {
  private readonly catalogService = inject(CatalogService);

  readonly promotions$ = this.catalogService
    .getProducts()
    .pipe(map((products) => products.filter((product) => product.isPromo)));
}
