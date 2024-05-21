import { Injectable } from '@angular/core';
import { ConfigService } from '../configs/config.service';
import { HttpProviderService } from '../http-provider/http-provider.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private config:ConfigService, private httpProvider:HttpProviderService) { }

  login(payload:any) {
    let header:any = { 'Content-Type':'application/x-www-form-urlencoded'}
    let body = new URLSearchParams();
    body.append('email',payload.email);
    body.append('password',payload.password)
    return this.httpProvider.post(this.config.urlConFig.USER_URLS.USER_LOGIN,body,{ headers: header});
  }
}
