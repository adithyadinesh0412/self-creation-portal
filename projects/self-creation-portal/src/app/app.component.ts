import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, CardComponent , SearchComponent, PaginationComponent} from 'lib-shared-modules';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,MatCardModule,CardComponent,SearchComponent,PaginationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
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
  
    receiveSearchResults(event:any){
    }

    onPaginatorChange(data:any){
    //   this.setPaginatorToFirstpage= false;
    // this.page = data.page;
    // this.limit = data.pageSize
    // this.fetchSessionList()
    }
}
