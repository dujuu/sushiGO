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
        <h1 class="display-font">Sushi fresco, sin vueltas. <span>Listo para pedir hoy.</span></h1>
        <p>
          Cocina activa todo el día, rolls preparados al momento y entrega confiable en tu zona. Haz tu pedido en
          menos de un minuto.
        </p>

        <div class="trust-row">
          <span>⭐ 4.9 en reseñas locales</span>
          <span>🕒 20–35 min promedio</span>
          <span>✅ Confirmación inmediata</span>
        </div>

        <div class="hero-actions">
          <button class="btn-primary" type="button" (click)="scrollToMenu()">Pedir en 1 minuto</button>
          <a class="btn-secondary" routerLink="/cart">Ver mi pedido</a>
        </div>

        <p class="urgency-note">Alta demanda 20:00–22:00 · reserva tu horario y evita esperas</p>
      </div>

      <img
        src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=80&fit=crop"
        alt="Equipo de cocina preparando sushi"
      />
    </section>

    <section class="promo-strip" aria-label="Promociones activas">
      <span>🍣 Rolls frescos diarios</span>
      <span>🛵 Delivery en Arica</span>
      <span>🔥 Combo 2x1 martes</span>
      <span>💬 Confirmación por WhatsApp</span>
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
                <div class="promo-prices">
                  @if (promo.originalPrice) {
                    <span class="promo-old">{{ promo.originalPrice | currency : 'CLP' : 'symbol' : '1.0-0' }}</span>
                  }
                  <strong>{{ promo.price | currency : 'CLP' : 'symbol' : '1.0-0' }}</strong>
                </div>
                <button class="btn-primary" type="button" (click)="add(promo)">Agregar al pedido</button>
              </div>
            </div>
          </article>
        }
      </div>
    </section>

    <section class="category-section">
      <div class="menu-header">
        <div>
          <div class="eyebrow">Categorías</div>
          <h2 class="display-font">¿Qué quieres comer hoy?</h2>
        </div>
        <small>Navegación rápida al menú</small>
      </div>

      <div class="category-grid">
        @for (category of categoryHighlights; track category.id) {
          <button class="category-card" type="button" (click)="setCategoryAndScroll(category.id)">
            <img [src]="category.imageUrl" [alt]="category.label" />
            <span class="overlay"></span>
            <span class="category-label display-font">{{ category.label }}</span>
          </button>
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

    <section class="build-section card">
      <div class="menu-header build-header">
        <div>
          <div class="eyebrow">Arma a tu gusto</div>
          <h2 class="display-font">Tu roll, en 3 pasos</h2>
        </div>
        <small>Simple y rápido para cerrar pedido</small>
      </div>

      <div class="build-steps">
        @for (step of buildSteps; track step.id) {
          <button
            type="button"
            class="build-step"
            [class.active]="activeBuildStep() === step.id"
            (click)="activeBuildStep.set(step.id)"
          >
            <span class="step-n">{{ step.id }}</span>
            <span>
              <strong>{{ step.title }}</strong>
              <small>{{ step.hint }}</small>
            </span>
          </button>
        }
      </div>

      <article class="build-panel">
        <h3 class="display-font">Paso {{ activeStepData().id }} · {{ activeStepData().title }}</h3>
        <p>{{ activeStepData().description }}</p>
        <div class="build-actions">
          <button class="btn-secondary" type="button" (click)="scrollToMenu()">Ver ingredientes</button>
          <a class="btn-primary" routerLink="/checkout">Continuar al pedido</a>
        </div>
      </article>
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
        background: linear-gradient(125deg, rgba(255, 90, 20, 0.06), transparent 40%),
          linear-gradient(180deg, color-mix(in srgb, var(--surface) 94%, #141418 6%), var(--surface));
        border: 1px solid color-mix(in srgb, var(--border) 88%, #3b2f28 12%);
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr;
        margin-bottom: 1rem;
        overflow: hidden;
        padding: 0;
        position: relative;
      }

      .hero-section::after {
        background: radial-gradient(520px 280px at 83% 10%, rgba(255, 90, 20, 0.14), transparent 72%);
        content: '';
        inset: 0;
        pointer-events: none;
        position: absolute;
      }

      .hero-content {
        padding: 1.2rem;
        position: relative;
        z-index: 1;
      }

      h1 {
        font-size: clamp(1.9rem, 3.5vw, 3rem);
        line-height: 1.07;
        margin: 0.4rem 0 0.75rem;
      }

      h1 span {
        color: var(--orange);
        display: block;
      }

      .hero-content p {
        color: var(--muted);
        font-size: 0.94rem;
        line-height: 1.56;
        max-width: 500px;
      }

      .trust-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        margin-top: 0.85rem;
      }

      .trust-row span {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid color-mix(in srgb, var(--border) 90%, #fff 10%);
        border-radius: 9px;
        color: #dbd3ca;
        font-size: 0.7rem;
        font-weight: 600;
        padding: 0.3rem 0.55rem;
      }

      .hero-actions {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        margin-top: 1.05rem;
      }

      .urgency-note {
        color: #c8b4a3;
        font-size: 0.76rem;
        letter-spacing: 0.1px;
        margin-top: 0.68rem;
      }

      .hero-section img {
        height: 100%;
        min-height: 260px;
        object-fit: cover;
        object-position: center 55%;
        position: relative;
        width: 100%;
        z-index: 1;
      }

      .promo-strip {
        align-items: center;
        background: linear-gradient(180deg, rgba(255, 90, 20, 0.09), rgba(255, 90, 20, 0.06));
        border: 1px solid color-mix(in srgb, var(--orange) 24%, transparent);
        border-radius: 11px;
        color: #f4dfd3;
        display: flex;
        flex-wrap: wrap;
        font-size: 0.71rem;
        font-weight: 650;
        gap: 0.85rem;
        justify-content: center;
        letter-spacing: 0.45px;
        margin: 1rem 0 1.2rem;
        padding: 0.62rem 0.9rem;
        text-transform: uppercase;
      }

      .featured-promos,
      .category-section,
      .menu-section,
      .build-section {
        margin-bottom: 1.4rem;
      }

      .menu-header {
        align-items: start;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: space-between;
        margin-bottom: 0.75rem;
      }

      .menu-header h2 {
        font-size: clamp(1.6rem, 2.5vw, 2.4rem);
      }

      .menu-header small {
        color: var(--muted);
        font-size: 0.76rem;
      }

      .promo-grid {
        display: grid;
        gap: 0.85rem;
        grid-template-columns: 1fr;
      }

      .promo-card {
        background: linear-gradient(180deg, color-mix(in srgb, var(--surface) 90%, #18181c 10%), var(--surface));
        border: 1px solid color-mix(in srgb, var(--border) 86%, #fff 14%);
        overflow: hidden;
        padding: 0;
        transition: border-color 0.24s ease, transform 0.24s ease;
      }

      .promo-card:hover {
        border-color: color-mix(in srgb, var(--orange) 32%, var(--border) 68%);
        transform: translateY(-2px);
      }

      .promo-card img {
        height: 185px;
        object-fit: cover;
        object-position: center;
        width: 100%;
      }

      .promo-content {
        padding: 0.94rem;
      }

      .promo-tag {
        background: color-mix(in srgb, var(--orange) 16%, transparent);
        border: 1px solid color-mix(in srgb, var(--orange) 32%, transparent);
        border-radius: 7px;
        color: #ffc3a5;
        font-size: 0.62rem;
        font-weight: 700;
        padding: 0.22rem 0.42rem;
        text-transform: uppercase;
      }

      .promo-content h3 {
        font-size: 1.12rem;
        margin: 0.45rem 0;
      }

      .promo-content p {
        color: var(--muted);
        font-size: 0.79rem;
      }

      .promo-actions {
        align-items: center;
        display: flex;
        gap: 0.5rem;
        justify-content: space-between;
        margin-top: 0.7rem;
      }

      .promo-actions strong {
        color: #fff0e8;
        font-size: 1.12rem;
      }

      .promo-prices {
        display: grid;
        gap: 0.05rem;
      }

      .promo-old {
        color: #b3a79e;
        font-size: 0.78rem;
        text-decoration: line-through;
      }

      .category-grid {
        display: grid;
        gap: 0.7rem;
        grid-template-columns: 1fr;
      }

      .category-card {
        border: 1px solid color-mix(in srgb, var(--border) 86%, #fff 14%);
        border-radius: 13px;
        cursor: pointer;
        min-height: 120px;
        overflow: hidden;
        padding: 0;
        position: relative;
        text-align: left;
        transition: transform 0.22s ease, border-color 0.22s ease;
      }

      .category-card:hover {
        border-color: color-mix(in srgb, var(--orange) 34%, var(--border) 66%);
        transform: translateY(-2px);
      }

      .category-card img {
        height: 100%;
        inset: 0;
        object-fit: cover;
        position: absolute;
        width: 100%;
      }

      .overlay {
        background: linear-gradient(180deg, rgba(7, 7, 8, 0.15), rgba(7, 7, 8, 0.78));
        inset: 0;
        position: absolute;
      }

      .category-label {
        bottom: 0.65rem;
        color: #fff4ec;
        font-size: 0.95rem;
        left: 0.7rem;
        position: absolute;
        z-index: 2;
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
        gap: 0.42rem;
        margin-bottom: 1.05rem;
      }

      .cat-tab {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.015), transparent);
        border: 1px solid color-mix(in srgb, var(--border) 90%, #fff 10%);
        border-radius: 10px;
        color: var(--muted);
        cursor: pointer;
        font-size: 0.74rem;
        font-weight: 600;
        letter-spacing: 0.2px;
        padding: 0.44rem 0.75rem;
        transition: border-color 0.2s, background 0.2s, color 0.2s;
      }

      .cat-tab.active {
        background: color-mix(in srgb, var(--orange) 16%, var(--surface) 84%);
        border-color: color-mix(in srgb, var(--orange) 40%, var(--border) 60%);
        color: #ffd4be;
      }

      .cat-tab:hover {
        border-color: color-mix(in srgb, var(--border-2) 70%, #fff 30%);
        color: #dcd3ca;
      }

      .grid {
        display: grid;
        gap: 0.9rem;
        grid-template-columns: 1fr;
      }

      .product-card {
        background: linear-gradient(180deg, color-mix(in srgb, var(--surface) 90%, #17171b 10%), var(--surface));
        border: 1px solid color-mix(in srgb, var(--border) 90%, #fff 10%);
        border-radius: 15px;
        box-shadow: 0 14px 26px rgba(0, 0, 0, 0.24);
        overflow: hidden;
        transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
      }

      .product-card:hover {
        border-color: color-mix(in srgb, var(--orange) 30%, var(--border) 70%);
        box-shadow: 0 20px 34px rgba(0, 0, 0, 0.3);
        transform: translateY(-2px);
      }

      .img-wrap {
        overflow: hidden;
        position: relative;
      }

      .img-wrap img {
        aspect-ratio: 4 / 3;
        object-fit: cover;
        width: 100%;
      }

      .badge {
        backdrop-filter: blur(8px);
        border-radius: 7px;
        color: #fff;
        font-size: 0.58rem;
        font-weight: 700;
        left: 0.65rem;
        letter-spacing: 0.35px;
        padding: 0.24rem 0.44rem;
        position: absolute;
        text-transform: uppercase;
        top: 0.65rem;
      }

      .badge.popular {
        background: color-mix(in srgb, var(--orange) 88%, #000 12%);
      }

      .badge.new {
        background: color-mix(in srgb, var(--gold) 86%, #000 14%);
        color: #161616;
      }

      .badge.promo {
        background: color-mix(in srgb, #2d7a50 88%, #000 12%);
      }

      .card-body {
        padding: 0.88rem;
      }

      .card-body h3 {
        font-size: 1.02rem;
        line-height: 1.2;
        margin-bottom: 0.32rem;
      }

      .meta-row {
        display: flex;
        font-size: 0.67rem;
        gap: 0.4rem;
        margin-bottom: 0.35rem;
      }

      .meta-row span {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid color-mix(in srgb, var(--border) 88%, #fff 12%);
        border-radius: 999px;
        color: #bfb5ac;
        padding: 0.18rem 0.4rem;
        text-transform: capitalize;
      }

      .card-body p {
        color: var(--muted);
        font-size: 0.79rem;
        line-height: 1.45;
        margin: 0.42rem 0 0.66rem;
        min-height: 40px;
      }

      .card-footer {
        display: grid;
        gap: 0.5rem;
      }

      .card-footer strong {
        color: #fff0e8;
        font-size: 1.15rem;
        letter-spacing: 0.2px;
      }

      .card-actions {
        display: flex;
        gap: 0.42rem;
      }

      .card-actions > * {
        flex: 1;
        text-align: center;
      }

      .build-section {
        border: 1px solid color-mix(in srgb, var(--border) 84%, #fff 16%);
        padding: 1rem;
      }

      .build-header {
        margin-bottom: 0.9rem;
      }

      .build-steps {
        display: grid;
        gap: 0.55rem;
        grid-template-columns: 1fr;
        margin-bottom: 0.85rem;
      }

      .build-step {
        align-items: center;
        background: color-mix(in srgb, var(--surface-2) 85%, #fff 15%);
        border: 1px solid var(--border-2);
        border-radius: 12px;
        color: var(--muted);
        cursor: pointer;
        display: flex;
        gap: 0.55rem;
        padding: 0.55rem;
        text-align: left;
        transition: border-color 0.2s, transform 0.2s, color 0.2s;
      }

      .build-step:hover {
        border-color: color-mix(in srgb, var(--orange) 28%, var(--border) 72%);
        transform: translateY(-1px);
      }

      .build-step.active {
        border-color: color-mix(in srgb, var(--orange) 38%, var(--border) 62%);
        color: #ecd9ca;
      }

      .step-n {
        align-items: center;
        background: color-mix(in srgb, var(--orange) 20%, transparent);
        border-radius: 999px;
        color: #ffd7c0;
        display: inline-flex;
        font-size: 0.72rem;
        font-weight: 700;
        height: 26px;
        justify-content: center;
        min-width: 26px;
      }

      .build-step strong {
        display: block;
        font-size: 0.8rem;
      }

      .build-step small {
        color: var(--muted);
        display: block;
        font-size: 0.7rem;
      }

      .build-panel {
        background: linear-gradient(180deg, color-mix(in srgb, var(--surface-2) 70%, #101013 30%), var(--surface));
        border: 1px solid color-mix(in srgb, var(--border) 88%, #fff 12%);
        border-radius: 12px;
        padding: 0.85rem;
      }

      .build-panel h3 {
        font-size: 1.05rem;
        margin: 0 0 0.35rem;
      }

      .build-panel p {
        color: var(--muted);
        font-size: 0.84rem;
        margin: 0;
      }

      .build-actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }

      .mobile-cart-cta {
        align-items: center;
        background: var(--orange);
        border-radius: 12px;
        bottom: 0.75rem;
        box-shadow: 0 10px 30px rgba(255, 77, 0, 0.35);
        color: #fff;
        display: inline-flex;
        font-size: 0.82rem;
        font-weight: 700;
        justify-content: space-between;
        left: 0.75rem;
        padding: 0.75rem;
        position: fixed;
        right: 0.75rem;
        z-index: 45;
      }

      @media (min-width: 480px) {
        .category-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .hero-content {
          padding: 1.4rem;
        }
      }

      @media (min-width: 768px) {
        .hero-section {
          grid-template-columns: 1.2fr 1fr;
        }

        .hero-actions {
          flex-direction: row;
        }

        .hero-section img {
          min-height: 320px;
        }

        .promo-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .category-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .menu-header {
          align-items: end;
          flex-direction: row;
          gap: 0;
        }

        .build-actions {
          flex-direction: row;
        }

        .mobile-cart-cta {
          display: none;
        }
      }

      @media (min-width: 1024px) {
        .grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .category-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .build-steps {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (min-width: 1280px) {
        .grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .category-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
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

  readonly categoryHighlights = [
    {
      id: 'rolls',
      label: 'Rolls clásicos',
      imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&q=80&fit=crop',
    },
    {
      id: 'spicy',
      label: 'Spicy',
      imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=900&q=80&fit=crop',
    },
    {
      id: 'veggie',
      label: 'Veggie',
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=900&q=80&fit=crop',
    },
    {
      id: 'combo',
      label: 'Combos',
      imageUrl: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=900&q=80&fit=crop',
    },
  ];

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

  readonly activeStepData = computed(() =>
    this.buildSteps.find((step) => step.id === this.activeBuildStep()) ?? this.buildSteps[0],
  );

  readonly promoProducts = computed(() =>
    this.catalogService.promotionsSnapshot(),
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

  setCategoryAndScroll(categoryId: string): void {
    this.activeCategory.set(categoryId);
    this.scrollToMenu();
  }

  scrollToMenu(): void {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  }
}
