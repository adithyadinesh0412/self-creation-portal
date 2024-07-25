import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

interface FilterChangeEvent {
  filterName: string;
  values: string[];
}
@Component({
  selector: 'lib-filter',
  standalone: true,
  imports: [MatSelectModule,MatFormFieldModule,MatIconModule,FormsModule,ReactiveFormsModule, TranslateModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  @Input() filterData:any;
  @Output() filteredData = new EventEmitter<FilterChangeEvent | { sort_by: string, sort_order: string }>();
  @Output() sortOptionsChanged = new EventEmitter<{ sort_by: string, sort_order: string }>();
  changeButton: string = "CHANGES_REQUIRED";
  @Input() changeReqCount: number = 0
  @Input() inprogressCount : number = 0
  @Output() filterButtonClickEvent = new EventEmitter<{ label: string }>();

  OnClickfilter(event:any, filter: any){
    if (["A_TO_Z", "Z_TO_A", "LATEST_FIRST", "OLDEST_FIRST"].includes(event.value)) {
      let sort_by = '';
      let sort_order = '';
      switch (event.value) {
        case "A_TO_Z":
          sort_by = 'title';
          sort_order = 'asc';
          break;
        case "Z_TO_A":
          sort_by = 'title';
          sort_order = 'desc';
          break;
        case "LATEST_FIRST":
          sort_by = 'created_at';
          sort_order = 'desc';
          break;
        case "OLDEST_FIRST":
          sort_by = 'created_at';
          sort_order = 'asc';
          break;
        default:
          sort_by = '';
          sort_order = '';
      }
      this.sortOptionsChanged.emit({ sort_by, sort_order });
    } else {
      if (filter.isMultiple) {
        const selectedValues = event.value as string[];
        this.filteredData.emit({ filterName: filter.value, values: selectedValues });
      } else {
        this.filteredData.emit({ filterName: filter.value, values: [event.value] });
      }
    }
  }

  onButtonClick(filter: any){
    this.filterButtonClickEvent.emit(filter)
  }
}
