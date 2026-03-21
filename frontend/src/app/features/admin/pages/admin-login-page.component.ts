import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="login-page">
      <form class="card login-card" [formGroup]="form" (ngSubmit)="submit()">
        <div>
          <p class="eyebrow">SushiGo</p>
          <h1 class="display-font">Acceso administrativo</h1>
          <p class="subtitle">Ingresa con una cuenta autorizada para gestionar el panel.</p>
        </div>

        <label>Email</label>
        <input type="email" formControlName="email" autocomplete="email" />

        <label>Contraseña</label>
        <input type="password" formControlName="password" autocomplete="current-password" />

        <button class="btn-primary" type="submit" [disabled]="saving() || form.invalid">
          {{ saving() ? 'Ingresando...' : 'Ingresar al panel' }}
        </button>

        <a routerLink="/catalog">Volver al sitio público</a>
      </form>
    </section>
  `,
  styles: [
    `
      .login-page {
        align-items: center;
        display: grid;
        min-height: 100dvh;
        padding: 1rem;
        place-items: center;
      }

      .login-card {
        display: grid;
        gap: 0.55rem;
        width: min(100%, 440px);
      }

      h1 {
        margin: 0.25rem 0;
      }

      .subtitle {
        color: var(--muted);
        font-size: 0.84rem;
        margin: 0;
      }

      label {
        color: #d8d0c9;
        font-size: 0.79rem;
        font-weight: 700;
      }

      input {
        background: var(--surface-2);
        border: 1px solid var(--border-2);
        border-radius: 10px;
        color: var(--white);
        padding: 0.6rem 0.7rem;
      }

      a {
        color: #c9beb5;
        font-size: 0.78rem;
        text-align: center;
      }
    `,
  ],
})
export class AdminLoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.notificationService.success('Bienvenido al panel administrativo.');
        this.saving.set(false);
        this.router.navigateByUrl('/admin/dashboard');
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }
}
