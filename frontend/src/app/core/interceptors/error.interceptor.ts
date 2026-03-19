import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const safeMessage =
        error.error?.message ||
        'No pudimos procesar la solicitud. Intenta nuevamente.';

      console.error('[HTTP ERROR]', {
        url: request.url,
        method: request.method,
        status: error.status,
      });

      return throwError(() => new Error(safeMessage));
    }),
  );
};
