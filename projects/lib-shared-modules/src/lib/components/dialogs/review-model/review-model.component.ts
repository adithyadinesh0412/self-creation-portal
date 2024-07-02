import { Component, Inject } from '@angular/core';
import { MatDialogModule,  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'lib-review-model',
  standalone: true,
  imports: [MatDialogModule, TranslateModule, MatFormFieldModule, MatRadioModule, MatIconModule, MatListModule, FormsModule],
  templateUrl: './review-model.component.html',
  styleUrl: './review-model.component.scss'
})
export class ReviewModelComponent {
  constructor(
    public dialogRef: MatDialogRef<ReviewModelComponent>,
    @Inject(MAT_DIALOG_DATA)  public dialogueData: any) { 
  }
}
