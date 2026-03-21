import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly loadingCounter = signal(0);

  readonly isLoading = computed(() => this.loadingCounter() > 0);

  show(): void {
    this.loadingCounter.update((value) => value + 1);
  }

  hide(): void {
    this.loadingCounter.update((value) => Math.max(0, value - 1));
  }
}
