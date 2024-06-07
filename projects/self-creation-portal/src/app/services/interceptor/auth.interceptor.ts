import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';

import { inject } from '@angular/core';
import { LibSharedModulesService } from 'lib-shared-modules';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const commonService = inject(LibSharedModulesService);
  const authToken = localStorage.getItem('accToken');
  let authReq = req.clone({})
  if(authToken) {
    authReq = req.clone({
      setHeaders: {
        'x-auth-token': `bearer ${authToken}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error)
      if (error.status === 401) {
        commonService.logout();
      }
      return throwError(error);
    }))
};
