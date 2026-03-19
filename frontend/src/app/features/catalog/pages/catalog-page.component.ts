import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../shared/models/catalog.model';
import { CatalogService } from '../services/catalog.service';
import { CartService } from '../../cart/services/cart.service';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CurrencyPipe, TitleCasePipe, RouterLink],
  template: `
    <section class="hero-section card">
      <div class="hero-content">
        <div class="eyebrow">Abierto ahora · Arica</div>
        <h1 class="display-font">El sushi que mereces. <span>Siempre fresco.</span></h1>
        <p>
          Rolls elaborados al momento, ingredientes premium y entrega rápida. Ordena sin registro en pocos pasos.
        </p>
        <div class="trust-row">
          <span>⭐ 4.9 en reseñas</span>
          <span>🕒 20 min promedio</span>
          <span>✅ Confirmación por WhatsApp</span>
        </div>
        <div class="hero-actions">
          <button class="btn-primary" type="button" (click)="scrollToMenu()">Pedir en 1 minuto</button>
          <a class="btn-secondary" routerLink="/cart">Ver mi pedido</a>
        </div>
        <p class="urgency-note">🔥 Alta demanda 20:00–22:00 · Pide antes para entrega más rápida</p>
      </div>
      <img
        src="https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=900&q=80&fit=crop"
        alt="Sushi premium"
      />
    </section>

    <section class="promo-strip" aria-label="Promociones activas">
      <span>🍣 Rolls frescos diarios</span>
      <span>🛵 Delivery en Arica</span>
      <span>🔥 Combo 2x1 martes</span>
      <span>⭐ +500 pedidos este mes</span>
    </section>

    <section class="kpi-grid">
      <article class="card kpi-card">
        <strong class="display-font">+500</strong>
        <small>Pedidos en Arica este mes</small>
      </article>
      <article class="card kpi-card">
        <strong class="display-font">96%</strong>
        <small>Entregas en tiempo estimado</small>
      </article>
      <article class="card kpi-card">
        <strong class="display-font">Top 3</strong>
        <small>Spicy Tuna, Dragon, Combo 2+1</small>
      </article>
    </section>

    <section class="featured-promos">
      <div class="menu-header">
        <div>
          <div class="eyebrow">Promociones</div>
          <h2 class="display-font">Ofertas de hoy</h2>
        </div>
      </div>

      <div class="promo-grid">
        @for (promo of promoProducts(); track promo.id) {
          <article class="card promo-card">
            <img [src]="promo.imageUrl" [alt]="promo.name" />
            <div class="promo-content">
              <span class="promo-tag">Promo activa</span>
              <h3 class="display-font">{{ promo.name }}</h3>
              <p>{{ promo.description }}</p>
              <div class="promo-actions">
                <strong>{{ promo.price | currency : 'CLP' : 'symbol' : '1.0-0' }}</strong>
                <button class="btn-primary" type="button" (click)="add(promo)">Agregar al pedido</button>
              </div>
            </div>
          </article>
        }
      </div>
    </section>

    <section class="menu-section" id="menu-section">
      <div class="menu-header">
        <div>
          <div class="eyebrow">Menú</div>
          <h2 class="display-font">Nuestros rolls</h2>
        </div>
        <small>Precios en pesos chilenos</small>
      </div>

      @if (flashMessage()) {
        <p class="flash">{{ flashMessage() }}</p>
      }

      <div class="cat-tabs">
        @for (tab of categories; track tab.id) {
          <button
            type="button"
            class="cat-tab"
            [class.active]="activeCategory() === tab.id"
            (click)="activeCategory.set(tab.id)"
          >
            <span>{{ tab.label }}</span>
          </button>
        }
      </div>

      <div class="grid">
        @for (product of filteredProducts(); track product.id) {
          <article class="product-card">
            <div class="img-wrap">
              <img [src]="product.imageUrl" [alt]="product.name" />
              @if (product.badge) {
                <span class="badge" [class]="'badge ' + product.badge">{{ badgeLabel(product.badge) }}</span>
              }
            </div>
            <div class="card-body">
              <h3 class="display-font">{{ product.name }}</h3>
              <div class="meta-row">
                <span>8 piezas</span>
                <span>{{ product.category | titlecase }}</span>
              </div>
              <p>{{ product.description }}</p>
              <div class="card-footer">
                <strong>{{ product.price | currency : 'CLP' : 'symbol' : '1.0-0' }}</strong>
                <div class="card-actions">
                  <button class="btn-primary" type="button" (click)="add(product)">Agregar</button>
                  <a class="btn-secondary" [routerLink]="['/catalog', product.id]">Detalle</a>
                </div>
              </div>
            </div>
          </article>
        }
      </div>
    </section>

    @if (cartService.itemCount() > 0) {
      <a class="mobile-cart-cta" routerLink="/cart">
        <span>{{ cartService.itemCount() }} productos</span>
        <strong>{{ cartService.total() | currency : 'CLP' : 'symbol' : '1.0-0' }}</strong>
        <span>Ver pedido →</span>
      </a>
    }
  `,
  styles: [
    `
      .hero-section {
        align-items: center;
        display: grid;
        gap: 1rem;
        grid-template-columns: 1.2fr 1fr;
        margin-bottom: 1rem;
        overflow: hidden;
        padding: 0;
      }

      .hero-content {
        padding: 2rem;
      }

      h1 {
        font-size: clamp(2rem, 4vw, 3.4rem);
        line-height: 1.02;
        margin: 0.4rem 0 0.8rem;
      }

      h1 span {
        color: var(--orange);
        display: block;
      }

      .hero-content p {
        color: var(--muted);
        max-width: 480px;
      }

      .trust-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.8rem;
      }

      .trust-row span {
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 999px;
        color: #d8d0c8;
        font-size: 0.72rem;
        font-weight: 600;
        padding: 0.3rem 0.65rem;
      }

      .hero-actions {
        display: flex;
        gap: 0.6rem;
        margin-top: 1rem;
      }

      .urgency-note {
        color: #ffb090;
        font-size: 0.8rem;
        margin-top: 0.7rem;
      }

      .hero-section img {
        height: 100%;
        min-height: 340px;
        object-fit: cover;
        width: 100%;
      }

      .promo-strip {
        align-items: center;
        background: var(--orange);
        border-radius: 12px;
        color: #fff;
        display: flex;
        flex-wrap: wrap;
        font-size: 0.76rem;
        font-weight: 700;
        gap: 1rem;
        justify-content: center;
        letter-spacing: 0.6px;
        margin: 1rem 0;
        padding: 0.7rem 1rem;
        text-transform: uppercase;
      }

      .kpi-grid {
        display: grid;
        gap: 0.8rem;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        margin: 1rem 0;
      }

      .kpi-card {
        display: grid;
        gap: 0.2rem;
      }

      .kpi-card strong {
        font-size: 1.4rem;
      }

      .kpi-card small {
        color: var(--muted);
        font-size: 0.8rem;
      }

      .featured-promos {
        margin: 1rem 0 1.6rem;
      }

      .promo-grid {
        display: grid;
        gap: 0.8rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .promo-card {
        overflow: hidden;
        padding: 0;
      }

      .promo-card img {
        height: 180px;
        object-fit: cover;
        width: 100%;
      }

      .promo-content {
        padding: 0.9rem;
      }

      .promo-tag {
        background: var(--orange-dim);
        border: 1px solid color-mix(in srgb, var(--orange) 45%, transparent);
        border-radius: 8px;
        color: var(--orange);
        font-size: 0.68rem;
        font-weight: 700;
        padding: 0.25rem 0.45rem;
        text-transform: uppercase;
      }

      .promo-content h3 {
        font-size: 1.2rem;
        margin: 0.45rem 0;
      }

      .promo-content p {
        color: var(--muted);
        font-size: 0.8rem;
      }

      .promo-actions {
        align-items: center;
        display: flex;
        gap: 0.5rem;
        justify-content: space-between;
        margin-top: 0.7rem;
      }

      .menu-section {
        margin-top: 1.2rem;
      }

      .menu-header {
        align-items: end;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.7rem;
      }

      .menu-header h2 {
        font-size: clamp(1.8rem, 3vw, 2.8rem);
      }

      .menu-header small {
        color: var(--muted);
      }

      .flash {
        background: color-mix(in srgb, var(--orange) 18%, transparent);
        border: 1px solid color-mix(in srgb, var(--orange) 40%, transparent);
        border-radius: 10px;
        color: #ffd8c7;
        margin: 0 0 1rem;
        padding: 0.5rem 0.7rem;
      }

      .cat-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .cat-tab {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 999px;
        color: var(--muted);
        cursor: pointer;
        font-size: 0.78rem;
        font-weight: 600;
        padding: 0.45rem 0.95rem;
        transition: all 0.2s;
      }

      .cat-tab.active {
        background: var(--orange-dim);
        border-color: color-mix(in srgb, var(--orange) 55%, transparent);
        color: var(--orange);
      }

      .grid {
        display: grid;
        gap: 0.8rem;
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .product-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        overflow: hidden;
        transition: transform 0.2s, border-color 0.2s;
      }

      .product-card:hover {
        border-color: color-mix(in srgb, var(--orange) 35%, transparent);
        transform: translateY(-3px);
      }

      .img-wrap {
        overflow: hidden;
        position: relative;
      }

      .img-wrap img {
        aspect-ratio: 1 / 1;
        object-fit: cover;
        width: 100%;
      }

      .badge {
        border-radius: 8px;
        color: #fff;
        font-size: 0.62rem;
        font-weight: 700;
        left: 0.65rem;
        letter-spacing: 0.4px;
        padding: 0.3rem 0.5rem;
        position: absolute;
        text-transform: uppercase;
        top: 0.65rem;
      }

      .badge.popular {
        background: var(--orange);
      }

      .badge.new {
        background: var(--gold);
        color: #161616;
      }

      .badge.promo {
        background: #2d7a50;
      }

      .card-body {
        padding: 0.85rem;
      }

      .card-body h3 {
        font-size: 1rem;
      }

      .meta-row {
        display: flex;
        font-size: 0.7rem;
        gap: 0.4rem;
        margin-bottom: 0.35rem;
      }

      .meta-row span {
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 999px;
        color: #c9bfb5;
        padding: 0.18rem 0.4rem;
        text-transform: capitalize;
      }

      .card-body p {
        color: var(--muted);
        font-size: 0.8rem;
        margin: 0.45rem 0 0.7rem;
        min-height: 40px;
      }

      .card-footer {
        display: grid;
        gap: 0.5rem;
      }

      .card-footer strong {
        font-size: 1.1rem;
      }

      .card-actions {
        display: flex;
        gap: 0.45rem;
      }

      .card-actions > * {
        flex: 1;
        text-align: center;
      }

      .mobile-cart-cta {
        align-items: center;
        background: var(--orange);
        border-radius: 12px;
        bottom: 0.75rem;
        box-shadow: 0 10px 30px rgba(255, 77, 0, 0.35);
        color: #fff;
        display: none;
        font-size: 0.82rem;
        font-weight: 700;
        justify-content: space-between;
        left: 0.75rem;
        padding: 0.75rem;
        position: fixed;
        right: 0.75rem;
        z-index: 45;
      }

      @media (max-width: 1050px) {
        .grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (max-width: 900px) {
        .hero-section {
          grid-template-columns: 1fr;
        }

        .hero-section img {
          min-height: 260px;
        }

        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .kpi-grid,
        .promo-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 600px) {
        .hero-content {
          padding: 1.2rem;
        }

        .menu-header {
          align-items: start;
          flex-direction: column;
          gap: 0.5rem;
        }

        .grid {
          grid-template-columns: 1fr;
        }

        .mobile-cart-cta {
          display: inline-flex;
        }
      }
    `,
  ],
})
export class CatalogPageComponent {
  private readonly catalogService = inject(CatalogService);
  readonly cartService = inject(CartService);

  readonly flashMessage = signal('');
  readonly activeCategory = signal('todos');
  readonly categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'rolls', label: 'Rolls clásicos' },
    { id: 'spicy', label: 'Spicy' },
    { id: 'veggie', label: 'Veggie' },
    { id: 'nigiri', label: 'Nigiri' },
    { id: 'combo', label: 'Combos' },
  ];
  readonly promoProducts = computed(() =>
    this.catalogService.snapshot().filter((product: Product) => product.isPromo),
  );
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
    setTimeout(() => this.flashMessage.set(''), 1500);
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

  scrollToMenu(): void {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  }
}
