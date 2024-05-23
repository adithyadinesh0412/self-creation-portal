import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LibSharedModulesService {

  private previousUrl !: string;
  constructor( private router : Router, private location : Location) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = event.url;
      }
    });
  }

  public goBack(): void {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl);
    }
  }
}