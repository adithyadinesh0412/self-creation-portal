import { HttpInterceptorFn } from '@angular/common/http';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('auth called.')
  const authToken = localStorage.getItem('accToken');
  let authReq = req.clone({})
  if(authToken) {
    authReq = req.clone({
      setHeaders: {
        'x-auth-token': `bearer ${authToken}`
      }
    });
  }

  return next(authReq);
};