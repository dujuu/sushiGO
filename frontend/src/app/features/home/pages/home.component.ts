import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SUSHI_GO_BUSINESS_PROFILE, SUSHI_GO_OPENING_HOURS_TEXT } from '../../../core/config/business-profile';
import { OFFICIAL_MENU_CATEGORIES, OFFICIAL_MENU_PRODUCTS } from '../../../core/data/official-menu.data';
import { Product } from '../../../shared/models/catalog.model';
import { PromotionService } from '../../../core/services/promotion.service';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { Promotion } from '../../../core/models/promotion.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, ImageFallbackDirective, RouterLink, CurrencyPipe],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly promotionService = inject(PromotionService);

  readonly businessProfile = SUSHI_GO_BUSINESS_PROFILE;
  readonly openingHours = SUSHI_GO_OPENING_HOURS_TEXT;

  readonly promotions = toSignal(
    this.promotionService.getPromotions({ is_active: true, per_page: 12 }).pipe(
      map((response) => response.data.filter((promotion) => promotion.is_active && promotion.is_real_promotion)),
      catchError(() => of([] as Promotion[])),
    ),
    { initialValue: [] },
  );

  readonly activePromotions = computed(() => this.promotions());

  readonly hasActivePromotions = computed(() => this.activePromotions().length > 0);

  readonly activeCategory = signal('todos');
  readonly categories = OFFICIAL_MENU_CATEGORIES;

  readonly visibleProducts = computed(() => {
    const category = this.activeCategory();

    if (category === 'todos') {
      return OFFICIAL_MENU_PRODUCTS.slice(0, 8);
    }

    return OFFICIAL_MENU_PRODUCTS.filter((product) => product.category === category).slice(0, 8);
  });

  trackByPromotionId(_: number, promotion: Promotion): number {
    return promotion.id;
  }

  trackByProductId(_: number, product: Product): number {
    return product.id;
  }
}
