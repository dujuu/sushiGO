import { Injectable, signal } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, of, tap } from 'rxjs';
import { LoginPayload, LoginResponse, MeResponse, AuthUser } from '../models/auth.model';
import { ApiService } from './api.service';

const AUTH_TOKEN_KEY = 'admin_token';
const AUTH_USER_KEY = 'admin_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = this.resolveStorage();

  readonly user = signal<AuthUser | null>(this.getStoredUser());
  readonly isAuthenticated = signal<boolean>(!!this.getToken());

  constructor(private readonly apiService: ApiService) {}

  async initializeSession(): Promise<void> {
    if (!this.getToken()) {
      this.forceLogout();
      return;
    }

    await firstValueFrom(
      this.me().pipe(
        map(() => void 0),
        catchError(() => {
          this.forceLogout();
          return of(void 0);
        }),
      ),
    );
  }

  login(payload: LoginPayload): Observable<AuthUser> {
    return this.apiService.post<LoginPayload, LoginResponse>('auth/login', payload).pipe(
      tap((response) => {
        this.storage?.setItem(AUTH_TOKEN_KEY, response.token);
        this.storage?.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
        this.user.set(response.user);
        this.isAuthenticated.set(true);
      }),
      map((response) => response.user),
    );
  }

  me(): Observable<AuthUser> {
    return this.apiService.get<MeResponse>('auth/me').pipe(
      tap((response) => {
        this.storage?.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
        this.user.set(response.user);
        this.isAuthenticated.set(true);
      }),
      map((response) => response.user),
    );
  }

  logout(): Observable<void> {
    return this.apiService.post<Record<string, never>, null>('auth/logout', {}).pipe(
      tap(() => this.clearSession()),
      map(() => void 0),
    );
  }

  forceLogout(): void {
    this.clearSession();
  }

  getToken(): string | null {
    return this.storage?.getItem(AUTH_TOKEN_KEY) ?? null;
  }

  private clearSession(): void {
    this.storage?.removeItem(AUTH_TOKEN_KEY);
    this.storage?.removeItem(AUTH_USER_KEY);
    this.user.set(null);
    this.isAuthenticated.set(false);
  }

  private getStoredUser(): AuthUser | null {
    const raw = this.storage?.getItem(AUTH_USER_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  private resolveStorage(): Storage | null {
    if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
      return null;
    }

    const candidate = globalThis.localStorage;
    if (!candidate || typeof candidate.getItem !== 'function') {
      return null;
    }

    return candidate;
  }
}
