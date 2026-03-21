import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-stack',
  standalone: true,
  template: `
    <div class="stack">
      @for (toast of notificationService.toasts(); track toast.id) {
        <article class="toast" [class]="toast.type">
          <span>{{ toast.text }}</span>
          <button type="button" (click)="notificationService.remove(toast.id)">×</button>
        </article>
      }
    </div>
  `,
  styles: [
    `
      .stack {
        bottom: 1rem;
        display: grid;
        gap: 0.5rem;
        position: fixed;
        right: 1rem;
        width: min(360px, calc(100vw - 2rem));
        z-index: 140;
      }

      .toast {
        align-items: center;
        backdrop-filter: blur(6px);
        border-radius: 10px;
        display: flex;
        font-size: 0.8rem;
        justify-content: space-between;
        padding: 0.58rem 0.7rem;
      }

      .success {
        background: rgba(46, 179, 127, 0.22);
        border: 1px solid rgba(46, 179, 127, 0.45);
      }

      .error {
        background: rgba(224, 84, 105, 0.22);
        border: 1px solid rgba(224, 84, 105, 0.45);
      }

      .warning {
        background: rgba(240, 166, 71, 0.22);
        border: 1px solid rgba(240, 166, 71, 0.45);
      }

      .info {
        background: rgba(91, 137, 245, 0.22);
        border: 1px solid rgba(91, 137, 245, 0.45);
      }

      button {
        background: transparent;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 1rem;
        line-height: 1;
      }
    `,
  ],
})
export class ToastStackComponent {
  readonly notificationService = inject(NotificationService);
}
