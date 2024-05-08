import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Angular component for a search input field.
 */
@Component({
  selector: 'lib-search',
  standalone: true,
  imports: [MatButtonModule,MatFormFieldModule,MatIconModule,MatInputModule,FormsModule,ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  // Minimum length of search text required to trigger the search. Default value is 3.
   @Input()  minLength:any = 3
  // Maximum length of the search text allowed.Default value is 250.
  @Input() maxLength: number = 250;
  /**
   * Event emitter for when a search is triggered.
   * @EventEmitter
   */
  @Output() searchEvent = new EventEmitter<any>();
   /**
   * FormControl for the search input field.
   * @FormControl
   */
  searchControl = new FormControl('');
  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(newValue => {
        this.search(newValue)
      });
  }
   /**
   * Perform a search when the search text meets the minimum length requirement.
   * @param searchText The text to search for.
   */
  search(searchText:any){
    if(searchText?.length >= this.minLength){
      this.searchEvent.emit(searchText);
    }
  }
}
