import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getToken()) {
    return router.createUrlTree(['/admin/login']);
  }

  const user = authService.user();
  if (user && user.role !== 'admin') {
    authService.forceLogout();
    return router.createUrlTree(['/admin/login']);
  }

  if (authService.getToken()) {
    return true;
  }

  return router.createUrlTree(['/admin/login']);
};
