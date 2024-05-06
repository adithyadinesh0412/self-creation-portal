import { Component, EventEmitter, Output } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'lib-search',
  standalone: true,
  imports: [MatButtonModule,MatFormFieldModule,MatIconModule,MatInputModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Output() searchEvent = new EventEmitter<string>();
 
  search(searchText:any){
    this.searchEvent.emit(searchText);
  }
}
