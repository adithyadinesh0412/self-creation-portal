import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';

import { inject } from '@angular/core';
import { LibSharedModulesService } from 'lib-shared-modules';
import { environment } from 'environments';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const commonService = inject(LibSharedModulesService);
  const authToken = localStorage.getItem('accToken');
  let authReq = req.clone({})
  if (req.headers.get('X-Requested-With') === 'XMLHttpRequest') {
    if(authToken) {
      authReq = req.clone({
        url: `${environment.baseURL}${req.url}`,
        setHeaders: {
          'x-auth-token': `bearer ${authToken}`
        }
      });
    }else {
      authReq = req.clone({
        url: `${environment.baseURL}${req.url}`
      });
    }
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error)
      if(error.status === 401){
        commonService.navigateToLogin()
      }
      return throwError(error);
    }))
};
