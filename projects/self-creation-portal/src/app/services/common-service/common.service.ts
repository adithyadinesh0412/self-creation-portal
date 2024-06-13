import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private router:Router) { }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  createUrlWithParams(baseUrl: string, params: { [key: string]: any }): string {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return `${baseUrl}?${httpParams.toString()}`;
  }
}
