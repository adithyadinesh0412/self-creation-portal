import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { HttpProviderService } from './services/http-provider.service';
import { LOGOUT_URLS } from './configs/url.config.json';

@Injectable({
  providedIn: 'root'
})
export class LibSharedModulesService {

  private previousUrl !: string;
  constructor( private router : Router, private location : Location, private httpService: HttpProviderService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = event.url; 
      }
    });
  }

  goBack(): void {
    this.location.back();
    // if (this.previousUrl) {
    //   this.router.navigateByUrl(this.previousUrl);
    // }
  }

  logout(): void {

    const body = {
      refresh_token: localStorage.getItem('refToken')
    };

    const config = {
      url:  LOGOUT_URLS.LOGOUT_API,
      payload: body
    };

    this.httpService.post(config.url, config.payload).subscribe(
      response => {
        console.log('Logout successful', response);
        this.navigateToLogin();
      },
      error => {
        console.error('Logout failed', error);
      }
    );
  }

  navigateToLogin(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
 