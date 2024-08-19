import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule,  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'lib-dialog-popup',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule, MatIconModule, TranslateModule,MatFormFieldModule,FormsModule,MatInputModule,MatCheckboxModule],
  templateUrl: './dialog-popup.component.html',
  styleUrl: './dialog-popup.component.scss'
})
export class DialogPopupComponent {
  reportContent: boolean = false;
  title: string = '';
  constructor(
    public dialogRef: MatDialogRef<DialogPopupComponent>,
    @Inject(MAT_DIALOG_DATA)  public dialogueData: any) { 
  }
}
