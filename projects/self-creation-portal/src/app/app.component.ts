import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, CardComponent , SearchComponent, PaginationComponent} from 'lib-shared-modules';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TranslateModule,RouterOutlet,HeaderComponent,MatCardModule,CardComponent,SearchComponent,PaginationComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.initializeTranslation();
  }
  
  private initializeTranslation(): void {
    this.translate.addLangs(['en', 'fr']);
    this.translate.setDefaultLang('en');
  }

  onClick(ln:any){
this.translate.use(ln)
  }
  list:any = 
    {
        "id": 4,
        "title": "sample project",
        "type": "project",
        "organization": {
            "id": 24,
            "name": "Tunerlabs",
            "code": "tl"
        },
        "status": "DRAFT",
        "actionButton":[{action:'VIEW',label:'View'},{ action:'EDIT',label:'Edit'}]
    }
}
