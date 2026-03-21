import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const notificationService = inject(NotificationService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const isSessionProbeUnauthorized =
        error.status === 401 && request.url.includes('/auth/me');

      if (isSessionProbeUnauthorized) {
        return throwError(() => error);
      }

      const safeMessage =
        error.error?.message ||
        error.message ||
        'No pudimos procesar la solicitud. Intenta nuevamente.';

      const friendlyMessage =
        error.status === 0
          ? 'No pudimos conectarnos con el servidor. Revisa la conexión e inténtalo nuevamente.'
          : error.status === 401
            ? 'Tu sesión no es válida. Inicia sesión nuevamente para continuar.'
            : error.status === 403
              ? 'No tienes permisos para realizar esta acción.'
              : error.status === 404
                ? 'No encontramos el recurso solicitado.'
                : error.status >= 500
                  ? 'Ocurrió un problema en el servidor. Intenta en unos minutos.'
                  : safeMessage;

      console.error('[HTTP ERROR]', {
        url: request.url,
        method: request.method,
        status: error.status,
      });

      notificationService.error(friendlyMessage);

      return throwError(() => new Error(friendlyMessage));
    }),
  );
};
