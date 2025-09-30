import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export class NetworkInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!navigator.onLine) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: 'Not internet connection',
            statusText: 'Offline',
            status: 0
          })
      );
    }
    return next.handle(req);
  }
}
