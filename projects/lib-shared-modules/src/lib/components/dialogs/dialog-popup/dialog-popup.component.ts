import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
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
export class DialogPopupComponent implements OnInit {
  reportContent: boolean = false;
  title: string = '';
  errorMessage: string = '';
  selectedFiles: File | undefined;
  @ViewChild('certificateContainer', { static: true }) certificateContainer: ElementRef | any;

  constructor(
    public dialogRef: MatDialogRef<DialogPopupComponent>, private renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA)  public dialogueData: any) {
      console.log(dialogueData)
  }

  ngOnInit(): void {
    if(this.dialogueData.certificate) {
      this.renderer.setProperty(
        this.certificateContainer?.nativeElement,
        'innerHTML',
        this.dialogueData.certificate.nativeElement.innerHTML
      );
    }
  }

  onDragOver(event: DragEvent){
    event.preventDefault();
  }

  onDragLeave(event: DragEvent){
    event.preventDefault();
  }

  onFileDropped(event: DragEvent){
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.validateAndUploadFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validateAndUploadFile(input.files[0]);
    }
  }

  validateAndUploadFile(file: File) {
    this.errorMessage = '';

    if (file.type !== 'image/png') {
      this.errorMessage = 'Only PNG files are allowed.';
      return;
    }

    if (file.size > 50000) {
      this.errorMessage = 'File size exceeds 50KB limit.';
      return;
    }
    this.selectedFiles = file;
    this.uploadFile(file);
  }

  uploadFile(file: File) {
    console.log('File selected:', file);
    const formData = new FormData();
    formData.append('file', file);
  }

  onAttach() {
    if(!this.selectedFiles) {
      this.errorMessage = 'Please attach file.';
      return;
    }
    else {
      this.dialogRef.close({ file: this.selectedFiles, additionalData: this.dialogueData});
    }
  }
}
