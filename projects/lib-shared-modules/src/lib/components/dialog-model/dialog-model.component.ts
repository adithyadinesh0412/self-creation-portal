import { Component, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule,  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lib-dialogue-model',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog-model.component.html',
  styleUrl: './dialog-model.component.scss'
})
export class DialogModelComponent {
  
  constructor(
    public dialogRef: MatDialogRef<DialogModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}
