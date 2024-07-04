import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogModule,  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule, MatListOption, MatSelectionList} from '@angular/material/list';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-review-model',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, MatFormFieldModule, MatRadioModule, MatIconModule, MatListModule, FormsModule],
  templateUrl: './review-model.component.html',
  styleUrl: './review-model.component.scss'
})
export class ReviewModelComponent {
  @ViewChild('reviewer') selectionList: MatSelectionList | undefined;
  selectedOption = 1
  constructor(
    public dialogRef: MatDialogRef<ReviewModelComponent>,
    @Inject(MAT_DIALOG_DATA)  public dialogueData: any) { 
  }

  ngAfterViewInit() {
    if(this.selectionList){
      this.selectionList.selectAll();
      }
  }
  
  onSelectReviewer(event: any) {
    if(this.selectionList){
      if (event.value === '1') {
        this.selectionList.selectAll();
      } else if (event.value === '2') {
        this.selectionList.deselectAll();
      }
    }
  }
  
  getSelectedValues(sendForReview:any,selectedOptions: MatListOption[]) {
    const selectedValues = selectedOptions.map(option => option.value);
    return {
            sendForReview: sendForReview,
            selectedValues : selectedValues ,
    }
}
}
