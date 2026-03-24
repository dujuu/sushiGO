import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from '../../features/cart/services/cart.service';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FooterComponent],
  template: `
    <header class="shell-header">
      <a class="brand" routerLink="/home">
        <span class="brand-mark">🍣</span>
        <span class="brand-text display-font">Sushi<span>Go</span></span>
      </a>

      <nav [class.open]="isMobileMenuOpen()">
        <a routerLink="/home" routerLinkActive="active" (click)="closeMobileMenu()">Inicio</a>
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

    <app-footer />

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

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
