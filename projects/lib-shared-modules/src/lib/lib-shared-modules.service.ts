import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HttpProviderService } from './services/http-provider.service';
import { LOGOUT_URLS } from './configs/url.config.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './services/toast/toast.service';
import { SUBMITTED_FOR_REVIEW } from './constants/urlConstants';

@Injectable({
  providedIn: 'root'
})
export class LibSharedModulesService {

  private previousUrl !: string;
  constructor( private router : Router, private location : Location, private httpService: HttpProviderService,private _snackBar:MatSnackBar,private translate: TranslateService,private toastService:ToastService, private route:ActivatedRoute) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = event.url;
      }
    });
  }

  goBack(): void {
    const state = this.route.snapshot.queryParamMap.get('parent')
    switch (state) {
      case 'create':
        this.router.navigate(['../'], { relativeTo: this.route });
        break;
      case 'review':
        this.router.navigate([SUBMITTED_FOR_REVIEW]);
        break;
      default:
        this.router.navigate(['../'], { relativeTo: this.route });
        break;
    }
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

  openErrorToast(message:any) {
      let data = {
        "message":message,
        "class":"error",
      }
     this.toastService.openSnackBar(data)
  }
}
