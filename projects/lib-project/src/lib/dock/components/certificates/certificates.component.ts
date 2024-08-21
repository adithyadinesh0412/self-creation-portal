import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogPopupComponent } from 'lib-shared-modules';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'lib-certificates',
  standalone: true,
  imports: [TranslateModule, MatIconModule, MatRadioModule, MatSelectModule, MatFormFieldModule, FormsModule, CommonModule, MatDialogModule],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent {
  selectedOption: string = '1'; 
  certificateType = [ 
    {
        "label": "ONE_LOGO_ONE_SIGNATURE",
        "value": "type",
        "option": [
            {
                "label": "ONE_LOGO_ONE_SIGNATURE",
                "value": "ONE_LOGO_ONE_SIGNATURE"
            },
            {
                "label": "ONE_LOGO_TWO_SIGNATURES",
                "value": "ONE_LOGO_TWO_SIGNATURES"
            },
            {
                "label": "TWO_LOGOS_ONE_SIGNATURE",
                "value": "TWO_LOGOS_ONE_SIGNATURE"
            },
            {
                "label": "ONE_LOGOS_TWO_SIGNATURES",
                "value": "ONE_LOGOS_TWO_SIGNATURES"
            }
        ],
    },
  ] 
  evidenceNumber = [1, 2, 3];

  constructor(private dialog : MatDialog){}

  attachLogo(){
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      disableClose: true,
      data : {
        header: "ATTACH_LOGO",
        subheader: "ATTACH_LOGOS_DETAIlS",
        subcontent:[
          { no: '1', option: '112px height X 46px base' },
          { no: '2', option: 'Size <= 50kb' },
          { no: '3', option: 'File type = PNG only' } 
        ],
        attachButton: "ATTACH"
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result.data === ""){
        return true
      } else {
        return false
      }
    })
  }

  attachSignature(){
    console.log("clcik")
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      disableClose: true,
      data : {
        header: "ATTACH_SIGNATURE",
        subheader: "ADD_SIGNATURE_DETALS",
        header2:"ATTACH_LOGO",
        subheader2:"ATTACH_LOGOS_DETAIlS",
        inputfields: [
          { label: "SIGNATURE_NAME", value: "", type: "text" },
          { label: "SIGNATURE_DESIGNATION", value: "" , type: "text" },
        ],
        subcontent:[
          { no: '1', option: '112px height X 46px base' },
          { no: '2', option: 'Size <= 50kb' },
          { no: '3', option: 'File type = PNG only' } 
        ],
        attachButton: "ATTACH"
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result.data === ""){
        return true
      } else {
        return false
      }
    })
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    // You can add styles here for when the file is being dragged over the area
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    // Revert styles when dragging leaves the area
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.uploadFile(event.dataTransfer.files);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile(input.files);
    }
  }

  uploadFile(files: FileList) {
    const file = files[0]; // Assuming single file upload
    console.log('File selected:', file);

    // Implement the actual upload logic here
    if (file.size > 50000) {
      alert('File size exceeds 50kb limit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // Call your upload service
    // this.fileUploadService.uploadFile(formData).subscribe(...);
  }
}