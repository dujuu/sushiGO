import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private toastId = 0;
  readonly toasts = signal<ToastMessage[]>([]);

  success(text: string): void {
    this.push('success', text);
  }

  error(text: string): void {
    this.push('error', text);
  }

  info(text: string): void {
    this.push('info', text);
  }

  warning(text: string): void {
    this.push('warning', text);
  }

  remove(id: number): void {
    this.toasts.update((items) => items.filter((item) => item.id !== id));
  }

  private push(type: ToastType, text: string): void {
    const id = ++this.toastId;
    this.toasts.update((items) => [...items, { id, type, text }]);

    setTimeout(() => this.remove(id), 3500);
  }
}
