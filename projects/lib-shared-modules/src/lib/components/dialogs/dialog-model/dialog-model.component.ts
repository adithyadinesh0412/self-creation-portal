import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule,  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-dialogue-model',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, MatIconModule, TranslateModule, FormsModule],
  templateUrl: './dialog-model.component.html',
  styleUrl: './dialog-model.component.scss'
})
export class DialogModelComponent {
  
  data : any
  constructor(
    public dialogRef: MatDialogRef<DialogModelComponent>,
    @Inject(MAT_DIALOG_DATA)  public dialogueData: any, private translate: TranslateService
  ) { 
    this.initializeTranslation();
  }
  
  private initializeTranslation(): void {
    this.translate.setDefaultLang('en');
  }
}
