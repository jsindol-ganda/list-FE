import { HttpInterceptorFn } from '@angular/common/http';

export const CorsInterceptor: HttpInterceptorFn = (req, next) => {
  req.headers.append('Access-Control-Allow-Origin', 'http://localhost:8080');
  req.headers.append('Access-Control-Allow-Credentials', 'true');
  return next(req);
};
