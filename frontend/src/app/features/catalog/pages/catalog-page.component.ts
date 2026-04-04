import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { interval, map, startWith } from 'rxjs';
import { SUSHI_GO_BUSINESS_PROFILE } from '../../../core/config/business-profile';
import {
  OFFICIAL_MENU_CATEGORIES,
  OFFICIAL_MENU_HIGHLIGHTS,
} from '../../../core/data/official-menu.data';
import { StoreHoursService } from '../../../core/services/store-hours.service';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { Product } from '../../../shared/models/catalog.model';
import { CatalogService } from '../services/catalog.service';
import { CartService } from '../../cart/services/cart.service';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CurrencyPipe, TitleCasePipe, RouterLink, ImageFallbackDirective],
  templateUrl: './catalog-page.component.html',
  styleUrls: ['./catalog-page.component.css'],
})
export class CatalogPageComponent {
  private readonly catalogService = inject(CatalogService);
  private readonly storeHoursService = inject(StoreHoursService);
  readonly cartService = inject(CartService);
  readonly businessProfile = SUSHI_GO_BUSINESS_PROFILE;
  readonly deliveryEta = '30–45 min';

  private readonly currentTime = toSignal(
    interval(60000).pipe(
      startWith(0),
      map(() => new Date()),
    ),
    { initialValue: new Date() },
  );

  readonly storeStatus = computed(() => this.storeHoursService.getCurrentStatus(this.currentTime()));

  readonly flashMessage = signal('');
  readonly activeCategory = signal('todos');
  readonly categories = OFFICIAL_MENU_CATEGORIES;

  readonly categoryHighlights = OFFICIAL_MENU_HIGHLIGHTS;

  readonly buildSteps = [
    {
      id: 1,
      title: 'Elige base',
      hint: 'Roll, nigiri o combo',
      description:
        'Parte por tu base favorita. Si quieres resolver rápido, los combos del día son la opción más conveniente.',
    },
    {
      id: 2,
      title: 'Personaliza',
      hint: 'Salsas e ingredientes',
      description:
        'Ajusta picante, agrega extras y define observaciones. Nuestro equipo revisa cada detalle antes de despachar.',
    },
    {
      id: 3,
      title: 'Confirma pedido',
      hint: 'Pago y despacho',
      description:
        'Cierra en checkout y confirma por WhatsApp si necesitas algo puntual. El precio final siempre se muestra claro.',
    },
  ];

  readonly activeBuildStep = signal(1);
  readonly recentlyAddedProductId = signal<number | null>(null);

  readonly activeStepData = computed(() =>
    this.buildSteps.find((step) => step.id === this.activeBuildStep()) ?? this.buildSteps[0],
  );

  readonly promoProducts = computed(() =>
    this.catalogService.promotionsSnapshot(),
  );

  readonly bestSellerProducts = computed(() =>
    this.catalogService
      .snapshot()
      .filter((product: Product) => product.badge === 'popular')
      .slice(0, 4),
  );

  readonly upsellSuggestion: Product = {
    id: 900001,
    name: 'Bebida lata 350ml',
    description: 'Complementa tu pedido con una bebida helada.',
    ingredients: ['Bebida'],
    price: 990,
    imageUrl:
      'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=900&q=80&fit=crop',
    category: 'extras',
    badge: 'new',
  };

  readonly filteredProducts = computed(() => {
    const category = this.activeCategory();
    if (category === 'todos') {
      return this.catalogService.snapshot();
    }

    return this.catalogService
      .snapshot()
      .filter((product: Product) => product.category === category);
  });

  add(product: Product): void {
    this.cartService.add(product);
    this.flashMessage.set(`${product.name} agregado al carrito`);
    this.recentlyAddedProductId.set(product.id);
    setTimeout(() => this.recentlyAddedProductId.set(null), 700);
    setTimeout(() => this.flashMessage.set(''), 1500);
  }

  quickDecrease(product: Product): void {
    const currentItem = this.cartService.items().find((item) => item.product.id === product.id);
    if (!currentItem) {
      return;
    }

    if (currentItem.quantity <= 1) {
      this.cartService.remove(product.id);
      return;
    }

    this.cartService.updateQuantity(product.id, currentItem.quantity - 1);
  }

  productQuantity(productId: number): number {
    return this.cartService.items().find((item) => item.product.id === productId)?.quantity ?? 0;
  }

  badgeLabel(badge: Product['badge']): string {
    if (badge === 'popular') {
      return 'Popular';
    }

    if (badge === 'new') {
      return 'Nuevo';
    }

    return 'Promo';
  }

  setCategoryAndScroll(categoryId: string): void {
    this.activeCategory.set(categoryId);
    this.scrollToMenu();
  }

  scrollToMenu(): void {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  }
}
