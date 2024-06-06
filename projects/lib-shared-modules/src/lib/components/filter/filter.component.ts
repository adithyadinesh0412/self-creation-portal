import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'lib-filter',
  standalone: true,
  imports: [MatSelectModule,MatFormFieldModule,MatIconModule,FormsModule,ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  @Input() filterData:any;
  @Input() showChangesButton: boolean = false
  @Output() filteredData = new EventEmitter();
  changeButton: string = "Changes required";

  OnClickfilter(event:any){
    this.filteredData.emit(event);
  }
}
