import { Injectable, signal } from '@angular/core';
import {
  BusinessSettings,
  DEFAULT_BUSINESS_SETTINGS,
} from '../models/business-settings.model';

const SETTINGS_KEY = 'sushigo_business_settings_v1';

@Injectable({ providedIn: 'root' })
export class BusinessSettingsService {
  readonly settings = signal<BusinessSettings>(this.load());

  save(next: BusinessSettings): void {
    this.settings.set(next);

    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
      globalThis.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    }
  }

  private load(): BusinessSettings {
    if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
      return DEFAULT_BUSINESS_SETTINGS;
    }

    const raw = globalThis.localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return DEFAULT_BUSINESS_SETTINGS;
    }

    try {
      return {
        ...DEFAULT_BUSINESS_SETTINGS,
        ...(JSON.parse(raw) as Partial<BusinessSettings>),
      };
    } catch {
      return DEFAULT_BUSINESS_SETTINGS;
    }
  }
}
