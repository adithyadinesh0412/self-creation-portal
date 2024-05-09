import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibSharedModulesService {

  private previousUrl !: string;
  private ngUnsubscribe = new Subject<void>();
  constructor( private router : Router, private location : Location, private activatedRoute: ActivatedRoute,) { 
    this.router.events
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          this.previousUrl = event.url;
        }
      });
  }

  public async goBack() : Promise<void> {
    if (this.previousUrl) {
      this.location.back();
    } else {
      await this.router.navigate([''], {
          relativeTo: this.activatedRoute,
      });
    }
    console.log("backbutton service")
  }
 
  ngOnDestroy(): void {
     this.ngUnsubscribe.next();
     this.ngUnsubscribe.complete();
  }
}
