import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, CardComponent , SearchComponent} from 'lib-shared-modules';
import {MatCardModule} from '@angular/material/card';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,MatCardModule,CardComponent,SearchComponent],
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

    trackByFn(index: number, item: any): any {
      return index;
    }

    receiveSearchResults(event:any){
      console.log(event)
    }



  
}
