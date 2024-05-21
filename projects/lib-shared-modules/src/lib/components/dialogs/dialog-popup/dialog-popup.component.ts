import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule,  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'lib-dialog-popup',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './dialog-popup.component.html',
  styleUrl: './dialog-popup.component.scss'
})
export class DialogPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogPopupComponent>,
    @Inject(MAT_DIALOG_DATA)  public dialogueData: any) { 
  }
}
