import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'lib-filter',
  standalone: true,
  imports: [MatSelectModule,MatFormFieldModule,MatIconModule,FormsModule,ReactiveFormsModule, TranslateModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  @Input() filterData:any;
  @Input() showChangesButton: boolean = false;
  @Output() filteredData = new EventEmitter<string | { sort_by: string, sort_order: string }>();
  @Output() sortOptionsChanged = new EventEmitter<{ sort_by: string, sort_order: string }>();
  changeButton: string = "CHANGES_REQUIRED";

  OnClickfilter(event:any){
    if (["A_TO_Z", "Z_TO_A", "LATEST_FIRST", "OLDEST_FIRST"].includes(event)) {
      let sort_by = '';
      let sort_order = '';
      switch (event) {
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
          sort_order = 'asc';
          break;
        case "OLDEST_FIRST":
          sort_by = 'created_at';
          sort_order = 'desc';
          break;
        default:
          sort_by = '';
          sort_order = '';
      }
      this.sortOptionsChanged.emit({ sort_by, sort_order });
    } else {
      this.filteredData.emit(event);
    }
  }
}
