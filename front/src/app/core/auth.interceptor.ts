import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const publicUrls = ['/login', '/register', '/verify', '/send-otp', '/reset-password'];

  const isPublic = publicUrls.some(url => req.url.includes(url));

  if (isPublic) {
    return next(req);
  }

  const token = localStorage.getItem('accessToken');
  if (token) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(req);
};
