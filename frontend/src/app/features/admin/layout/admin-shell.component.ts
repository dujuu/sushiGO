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
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.css'],
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
