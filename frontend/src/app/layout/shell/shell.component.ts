import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from '../../features/cart/services/cart.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="shell-header">
      <a class="brand" routerLink="/catalog">
        <span class="brand-mark">🍣</span>
        <span class="brand-text display-font">Sushi<span>Go</span></span>
      </a>

      <nav [class.open]="isMobileMenuOpen()">
        <a routerLink="/catalog" routerLinkActive="active" (click)="closeMobileMenu()">Menú</a>
        <a routerLink="/promotions" routerLinkActive="active" (click)="closeMobileMenu()">Promos</a>
        <a routerLink="/checkout" routerLinkActive="active" (click)="closeMobileMenu()">Pedido</a>
      </nav>

      <div class="header-actions">
        <a routerLink="/cart" routerLinkActive="active" class="cart-link">
          <span>Mi pedido</span>
          @if (cartService.itemCount() > 0) {
            <span class="badge" aria-label="Productos en carrito">{{ cartService.itemCount() }}</span>
          }
        </a>

        <button class="menu-btn" type="button" (click)="toggleMobileMenu()" aria-label="Abrir menú">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>

    <main class="shell-main">
      <router-outlet />
    </main>

    <footer class="shell-footer">
      <div class="shell-footer-inner">
        <section class="footer-grid">
          <div class="footer-col">
            <h4 class="display-font">SushiGo</h4>
            <a routerLink="/catalog">Carta sushi</a>
            <a routerLink="/promotions">Promociones</a>
            <a routerLink="/checkout">Arma tu pedido</a>
            <a routerLink="/cart">Mi carrito</a>
          </div>

          <div class="footer-col">
            <h4 class="display-font">Ayuda</h4>
            <a href="#" rel="nofollow">Contacto</a>
            <a href="#" rel="nofollow">Preguntas frecuentes</a>
            <a href="#" rel="nofollow">Términos y condiciones</a>
            <a href="#" rel="nofollow">Sugerencias y reclamos</a>
          </div>

          <div class="footer-col">
            <h4 class="display-font">Síguenos</h4>
            <div class="social-row" aria-label="Redes sociales SushiGo">
              <a href="#" class="social-btn" aria-label="Facebook" rel="nofollow">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.1 8.4h1.7V6h-2c-2 0-3.2 1.2-3.2 3.3v1.4H8.9V13h1.7v5h2.6v-5h2.2l.3-2.3h-2.5V9.5c0-.7.2-1.1.9-1.1Z" fill="currentColor"/></svg>
              </a>
              <a href="#" class="social-btn" aria-label="Instagram" rel="nofollow">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.8 3h8.4A4.8 4.8 0 0 1 21 7.8v8.4a4.8 4.8 0 0 1-4.8 4.8H7.8A4.8 4.8 0 0 1 3 16.2V7.8A4.8 4.8 0 0 1 7.8 3Zm8.5 1.7a3.2 3.2 0 0 1 3.2 3.2v8.2a3.2 3.2 0 0 1-3.2 3.2H7.9a3.2 3.2 0 0 1-3.2-3.2V7.9a3.2 3.2 0 0 1 3.2-3.2h8.4Zm-4.2 2.8a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 1.7a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8Zm4.9-2.2a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z" fill="currentColor"/></svg>
              </a>
              <a href="#" class="social-btn" aria-label="TikTok" rel="nofollow">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5 4.2c.6 1.1 1.5 2 2.7 2.4V9a6.1 6.1 0 0 1-2.7-.7v5.2a4.5 4.5 0 1 1-4.4-4.5v2.5a2 2 0 1 0 1.9 2V3h2.5v1.2Z" fill="currentColor"/></svg>
              </a>
            </div>
            <small>Atención todos los días de 12:30 a 23:00</small>
          </div>

          <div class="footer-col badges-col">
            <h4 class="display-font">Pagos</h4>
            <div class="payment-grid" aria-label="Métodos de pago">
              <span class="pay-badge">Visa</span>
              <span class="pay-badge">Mastercard</span>
              <span class="pay-badge">Redcompra</span>
              <span class="pay-badge">Transbank</span>
              <span class="pay-badge">Edenred</span>
            </div>
          </div>
        </section>

        <div class="footer-bottom">
          <span>© {{ currentYear }} SushiGo · Arica, Chile</span>
          <span>Pedidos rápidos, claros y sin fricción</span>
        </div>
      </div>
    </footer>

    <a
      class="whatsapp-float"
      href="https://wa.me/56900000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Pedir por WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 12A8.5 8.5 0 0 1 7 18.8L3.7 20l1.3-3.2A8.5 8.5 0 1 1 20.5 12Zm-4 2.7c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.2-.4.1a6.2 6.2 0 0 1-3.1-2.7c-.1-.2 0-.3.1-.4l.3-.4.2-.3v-.3l-.6-1.5c-.1-.2-.2-.2-.4-.2h-.3a.7.7 0 0 0-.5.2 2.2 2.2 0 0 0-.7 1.7c0 1 .7 2 1 2.5.1.1 1.4 2.3 3.4 3.1 2 .9 2 .6 2.4.6.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1Z" fill="currentColor"/></svg>
      <span>WhatsApp</span>
    </a>
  `,
  styles: [
    `
      .shell-header {
        align-items: center;
        backdrop-filter: blur(18px) saturate(1.5);
        background: linear-gradient(180deg, rgba(9, 9, 11, 0.9), rgba(9, 9, 11, 0.78));
        border-bottom: 1px solid color-mix(in srgb, var(--border) 88%, #3a312a 12%);
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
        display: flex;
        min-height: 4.25rem;
        justify-content: space-between;
        left: 0;
        padding: 0 clamp(0.75rem, 3vw, 1.5rem);
        position: fixed;
        right: 0;
        top: 0;
        z-index: 40;
      }

      .brand {
        align-items: center;
        display: inline-flex;
        gap: 0.55rem;
      }

      .brand-mark {
        align-items: center;
        background: linear-gradient(160deg, #ff6f33, var(--orange));
        border-radius: 10px;
        box-shadow: 0 8px 18px rgba(255, 90, 20, 0.2);
        display: inline-flex;
        font-size: 1.05rem;
        height: 34px;
        justify-content: center;
        width: 34px;
      }

      .brand-text {
        font-size: 1.28rem;
        font-weight: 800;
      }

      .brand-text span {
        color: var(--orange);
      }

      nav {
        background: linear-gradient(180deg, rgba(13, 13, 15, 0.98), rgba(13, 13, 15, 0.95));
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.42);
        display: none;
        flex-direction: column;
        gap: 0.3rem;
        padding: 0.45rem;
        position: absolute;
        right: 0.75rem;
        top: 3.85rem;
        width: min(85vw, 16rem);
        z-index: 50;
      }

      nav.open {
        display: flex;
      }

      nav a {
        border-radius: 9px;
        color: var(--muted);
        font-size: 0.82rem;
        font-weight: 600;
        padding: 0.45rem 0.72rem;
        transition: color 0.2s, background 0.2s, border-color 0.2s;
      }

      nav a.active {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid color-mix(in srgb, var(--border) 84%, #fff 16%);
        color: var(--white);
      }

      nav a:hover {
        background: color-mix(in srgb, var(--surface-2) 90%, #fff 10%);
        color: var(--white);
      }

      .header-actions {
        align-items: center;
        display: flex;
        gap: 0.55rem;
      }

      .cart-link {
        align-items: center;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
        border: 1px solid var(--border-2);
        border-radius: 11px;
        color: var(--white);
        display: inline-flex;
        font-size: 0.82rem;
        font-weight: 700;
        gap: 0.35rem;
        padding: 0.45rem 0.7rem;
      }

      .cart-link:hover,
      .cart-link.active {
        background: color-mix(in srgb, var(--surface-2) 82%, #fff 18%);
        border-color: color-mix(in srgb, var(--border-2) 82%, #fff 18%);
      }

      .badge {
        align-items: center;
        background: linear-gradient(180deg, #ff7640, var(--orange));
        border-radius: 999px;
        color: #fff;
        display: inline-flex;
        font-size: 0.7rem;
        font-weight: 700;
        height: 20px;
        justify-content: center;
        min-width: 20px;
        padding: 0 0.35rem;
      }

      .menu-btn {
        background: transparent;
        border: 1px solid var(--border-2);
        border-radius: 10px;
        display: inline-flex;
        flex-direction: column;
        height: 36px;
        justify-content: center;
        padding: 0.4rem;
        width: 36px;
      }

      .menu-btn span {
        background: var(--white);
        border-radius: 2px;
        display: block;
        height: 2px;
        margin: 3px 0;
        width: 100%;
      }

      .shell-main {
        margin: 0 auto;
        max-width: min(100%, 80rem);
        padding: calc(4.25rem + 1rem) clamp(0.75rem, 2.5vw, 1.5rem) 1rem;
      }

      .shell-footer {
        background: linear-gradient(180deg, rgba(9, 9, 11, 0.5), rgba(7, 7, 9, 0.92));
        border-top: 1px solid color-mix(in srgb, var(--border) 85%, #3d312a 15%);
        margin-top: 1.2rem;
      }

      .shell-footer-inner {
        margin: 0 auto;
        max-width: 1120px;
        padding: 1.5rem 1rem 1rem;
      }

      .footer-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr;
      }

      .footer-col {
        display: flex;
        flex-direction: column;
        gap: 0.42rem;
      }

      .footer-col h4 {
        font-size: 0.95rem;
        letter-spacing: 0.1px;
        margin: 0 0 0.2rem;
      }

      .footer-col a {
        color: #bdb5ad;
        font-size: 0.82rem;
        transition: color 0.18s;
        width: fit-content;
      }

      .footer-col a:hover {
        color: #f2ece6;
      }

      .social-row {
        display: flex;
        gap: 0.5rem;
      }

      .social-btn {
        align-items: center;
        background: linear-gradient(180deg, #ff6b2f, var(--orange));
        border-radius: 999px;
        color: #fff;
        display: inline-flex;
        height: 32px;
        justify-content: center;
        width: 32px;
      }

      .social-btn svg {
        height: 16px;
        width: 16px;
      }

      .footer-col small {
        color: #9d948c;
        font-size: 0.73rem;
        margin-top: 0.25rem;
      }

      .badges-col {
        align-items: flex-start;
      }

      .payment-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.48rem;
      }

      .pay-badge {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 9px;
        color: #232323;
        display: inline-flex;
        font-size: 0.69rem;
        font-weight: 700;
        letter-spacing: 0.1px;
        padding: 0.34rem 0.58rem;
      }

      .footer-bottom {
        border-top: 1px solid color-mix(in srgb, var(--border) 85%, #fff 15%);
        color: #aaa29b;
        display: flex;
        flex-direction: column;
        font-size: 0.76rem;
        gap: 0.35rem;
        margin-top: 1.1rem;
        padding-top: 0.75rem;
      }

      .whatsapp-float {
        align-items: center;
        background: #25d366;
        border: 3px solid rgba(255, 255, 255, 0.9);
        border-radius: 999px;
        bottom: 1rem;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
        color: #0a2915;
        display: inline-flex;
        font-size: 0.82rem;
        font-weight: 800;
        gap: 0.35rem;
        padding: 0.54rem 0.72rem;
        position: fixed;
        right: 1rem;
        z-index: 60;
      }

      .whatsapp-float svg {
        height: 16px;
        width: 16px;
      }

      @media (max-width: 479px) {
        .whatsapp-float span {
          display: none;
        }

        .whatsapp-float {
          height: 46px;
          justify-content: center;
          padding: 0;
          width: 46px;
        }
      }

      @media (min-width: 480px) {
        .footer-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (min-width: 768px) {
        nav {
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;
          display: flex;
          flex-direction: row;
          padding: 0;
          position: static;
          width: auto;
        }

        .menu-btn {
          display: none;
        }

        .shell-main {
          padding-top: calc(4.25rem + 1.25rem);
        }
      }

      @media (min-width: 1024px) {
        .footer-grid {
          grid-template-columns: 1fr 1fr 1fr 1.2fr;
        }

        .footer-bottom {
          flex-direction: row;
          justify-content: space-between;
        }
      }

      @media (min-width: 1280px) {
        .shell-main {
          padding-inline: 1.75rem;
        }
      }
    `,
  ],
})
export class ShellComponent {
  readonly cartService = inject(CartService);
  readonly isMobileMenuOpen = signal(false);
  readonly hasItems = computed(() => this.cartService.itemCount() > 0);
  readonly currentYear = new Date().getFullYear();

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
