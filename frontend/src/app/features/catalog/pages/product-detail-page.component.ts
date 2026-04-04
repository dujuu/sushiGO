import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { CatalogService } from '../services/catalog.service';
import { CartService } from '../../cart/services/cart.service';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, ImageFallbackDirective],
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.css'],
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
