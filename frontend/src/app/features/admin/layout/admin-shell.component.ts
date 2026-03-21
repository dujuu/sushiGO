import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { ToastStackComponent } from '../../../shared/components/toast-stack/toast-stack.component';
import { LoadingService } from '../../../core/services/loading.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoadingOverlayComponent, ToastStackComponent],
  template: `
    <div class="admin-shell">
      <aside class="card sidebar">
        <div class="sidebar-top">
          <h2 class="display-font">SushiGo Admin</h2>
          <button class="menu-toggle" type="button" (click)="toggleNav()" aria-label="Abrir menú admin">
            ☰
          </button>
        </div>

        @if (authService.user(); as user) {
          <section class="admin-profile">
            <span class="avatar" aria-hidden="true">{{ getInitials(user.name) }}</span>
            <div>
              <strong>{{ user.name }}</strong>
              <small>{{ user.email }}</small>
            </div>
          </section>
        }

        <nav [class.open]="isNavOpen()">
          <a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/admin/products" routerLinkActive="active">Productos</a>
          <a routerLink="/admin/promotions" routerLinkActive="active">Promociones</a>
          <a routerLink="/admin/orders" routerLinkActive="active">Historial</a>
          <a routerLink="/admin/settings" routerLinkActive="active">Configuración</a>
          <a routerLink="/catalog">Volver al sitio</a>
          <button type="button" class="logout-btn" (click)="logout()">Cerrar sesión</button>
        </nav>
      </aside>

      <main>
        <router-outlet />
      </main>

      <app-loading-overlay [visible]="loadingService.isLoading()" message="Procesando..." />
      <app-toast-stack />
    </div>
  `,
  styles: [
    `
      .admin-shell {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr;
        min-height: 100dvh;
        padding: clamp(0.75rem, 2vw, 1rem);
      }

      .sidebar {
        align-content: start;
        display: grid;
        gap: 0.85rem;
        height: max-content;
      }

      .sidebar-top {
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      h2 {
        font-size: 1.2rem;
        margin: 0;
      }

      nav {
        display: none;
        gap: 0.35rem;
      }

      nav.open {
        display: grid;
      }

      .menu-toggle {
        background: var(--surface-2);
        border: 1px solid var(--border-2);
        border-radius: 0.625rem;
        color: var(--white);
        min-height: 2.5rem;
        min-width: 2.5rem;
      }

      .admin-profile {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border);
        border-radius: 10px;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        padding: 0.5rem 0.55rem;
      }

      .avatar {
        align-items: center;
        background: linear-gradient(180deg, #ff6f33, var(--orange));
        border-radius: 999px;
        color: #fff;
        display: inline-flex;
        font-size: 0.72rem;
        font-weight: 800;
        height: 34px;
        justify-content: center;
        min-width: 34px;
      }

      .admin-profile strong {
        color: var(--white);
        font-size: 0.82rem;
      }

      .admin-profile small {
        color: var(--muted);
        font-size: 0.72rem;
      }

      a {
        border: 1px solid transparent;
        border-radius: 10px;
        color: #ddd4cd;
        font-size: 0.85rem;
        padding: 0.48rem 0.55rem;
        text-decoration: none;
      }

      a.active {
        background: rgba(255, 255, 255, 0.06);
        border-color: var(--border-2);
        color: var(--white);
      }

      .logout-btn {
        background: transparent;
        border: 1px solid #7d3e47;
        border-radius: 10px;
        color: #f2b0ba;
        cursor: pointer;
        font-size: 0.82rem;
        font-weight: 600;
        margin-top: 0.2rem;
        padding: 0.48rem 0.55rem;
        text-align: left;
      }

      main {
        min-width: 0;
      }

      @media (min-width: 768px) {
        .admin-shell {
          grid-template-columns: 240px minmax(0, 1fr);
        }

        .sidebar {
          position: sticky;
          top: 1rem;
        }

        nav {
          display: grid;
        }

        .menu-toggle {
          display: none;
        }
      }

      @media (min-width: 1024px) {
        .admin-shell {
          gap: 1.25rem;
        }
      }

      @media (max-width: 767px) {
        nav {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminShellComponent {
  readonly loadingService = inject(LoadingService);
  readonly authService = inject(AuthService);
  readonly isNavOpen = signal(false);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  toggleNav(): void {
    this.isNavOpen.update((value) => !value);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.notificationService.info('Sesión cerrada correctamente.');
        this.router.navigateByUrl('/admin/login');
      },
      error: () => {
        this.authService.forceLogout();
        this.router.navigateByUrl('/admin/login');
      },
    });
  }

  getInitials(name: string): string {
    const parts = name
      .split(' ')
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .slice(0, 2);

    return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || 'AD';
  }
}
