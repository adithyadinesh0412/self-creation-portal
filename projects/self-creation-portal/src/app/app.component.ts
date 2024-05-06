import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, CardComponent } from 'lib-shared-modules';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
// import { CommonModule } from '@angular/common'
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,MatCardModule,CardComponent,MatButtonModule,MatFormFieldModule,MatIconModule],
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
    heroes:any = [
      {name:"Suma"},
      {name:"NN"}
    ]

}
