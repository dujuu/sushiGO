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
  `,
  styles: [
    `
      .shell-header {
        align-items: center;
        backdrop-filter: blur(18px) saturate(1.5);
        background: rgba(8, 8, 8, 0.84);
        border-bottom: 1px solid var(--border);
        display: flex;
        height: 68px;
        justify-content: space-between;
        left: 0;
        padding: 0 1rem;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 30;
      }

      .brand {
        align-items: center;
        display: inline-flex;
        gap: 0.55rem;
      }

      .brand-mark {
        align-items: center;
        background: var(--orange);
        border-radius: 10px;
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
        display: flex;
        gap: 0.3rem;
      }

      nav a {
		border-radius: 8px;
        color: var(--muted);
        font-size: 0.82rem;
        font-weight: 600;
        padding: 0.45rem 0.7rem;
        transition: color 0.2s, background 0.2s;
      }

      nav a.active {
        color: var(--white);
      }

      nav a:hover {
        background: var(--surface-2);
        color: var(--white);
      }

      .header-actions {
        align-items: center;
        display: flex;
        gap: 0.55rem;
      }

      .cart-link {
        align-items: center;
        background: var(--surface-2);
        border: 1px solid var(--border-2);
        border-radius: 12px;
        color: var(--white);
        display: inline-flex;
        font-size: 0.82rem;
        font-weight: 700;
        gap: 0.35rem;
        padding: 0.45rem 0.7rem;
      }

      .badge {
        align-items: center;
        background: var(--orange);
        border-radius: 999px;
        color: #fff;
        display: inline-flex;
        font-size: 0.75rem;
        height: 20px;
        justify-content: center;
        min-width: 20px;
        padding: 0 0.35rem;
      }

      .menu-btn {
        background: transparent;
        border: 1px solid var(--border-2);
        border-radius: 10px;
        display: none;
        height: 36px;
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
        max-width: 1120px;
        padding: calc(68px + 1rem) 1rem 1rem;
      }

      @media (max-width: 680px) {
        nav {
          background: rgba(10, 10, 10, 0.98);
          border: 1px solid var(--border);
          border-radius: 12px;
          display: none;
          flex-direction: column;
          padding: 0.45rem;
          position: absolute;
          right: 1rem;
          top: 62px;
          width: 180px;
        }

        nav.open {
          display: flex;
        }

        .menu-btn {
          display: inline-flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    `,
  ],
})
export class ShellComponent {
  readonly cartService = inject(CartService);
  readonly isMobileMenuOpen = signal(false);
  readonly hasItems = computed(() => this.cartService.itemCount() > 0);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
