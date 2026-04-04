import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CatalogService } from '../../catalog/services/catalog.service';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-promotions-page',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, ImageFallbackDirective],
  templateUrl: './promotions-page.component.html',
  styleUrls: ['./promotions-page.component.css'],
})
export class PromotionsPageComponent {
  private readonly catalogService = inject(CatalogService);

  readonly promotions$ = this.catalogService.getPromotions();
}
