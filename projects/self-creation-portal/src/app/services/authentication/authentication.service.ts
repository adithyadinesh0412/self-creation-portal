import { Injectable } from '@angular/core';
import { ConfigService } from '../configs/config.service';
import { HttpProviderService } from '../http-provider/http-provider.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private config:ConfigService, private httpProvider:HttpProviderService) { }

  // API functions should be called from here
}
