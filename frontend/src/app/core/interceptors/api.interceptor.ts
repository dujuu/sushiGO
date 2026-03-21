import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const cloned = request.clone({
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  return next(cloned).pipe(
    catchError((error) => {
      const isUnauthorized = error?.status === 401;
      const isLoginRequest = request.url.includes('/auth/login');

      if (isUnauthorized && !isLoginRequest && authService.getToken()) {
        authService.forceLogout();
        router.navigateByUrl('/admin/login');
      }

      return throwError(() => error);
    }),
  );
};
