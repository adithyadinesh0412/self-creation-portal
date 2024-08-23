import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogPopupComponent } from 'lib-shared-modules';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'lib-certificates',
  standalone: true,
  imports: [TranslateModule, MatIconModule, MatRadioModule, MatSelectModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent implements OnInit{
  certificateForm !: FormGroup 
  attachedLogos: Array<{ name: string }> = [];
  attachedSignatures: Array<{ name: string }> = [];
  certificateTypeSelected = false;
  certificateType = [ 
    {
        "label": "SELECT_CERTIFICATE_TYPE",
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

  constructor(private dialog : MatDialog, private fb: FormBuilder,){}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.certificateForm = this.fb.group({
      selectedOption: [''],
      certificateType: ['', Validators.required],
      issuerName: ['', Validators.required],
      evidenceRequired: ['', Validators.required],
      enableTaskEvidence: ['1'],
      attachedLogos: this.fb.array([]),
      attachedSignatures: this.fb.array([]),
    });
  }

  onCertificateTypeChange(value: string): void {
    this.certificateTypeSelected = !!value;
  }

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
      if (result && result.fileName) {
        this.attachedLogos.push({ name: result.fileName });
      } else {
        return false
      }
    })
  }

  attachSignature(){
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
      if (result && result.fileName) {
        this.attachedSignatures.push({ name: result.fileName });
      } else {
        return false
      }
    })
  }

  removeLogo(index: number) {
    this.attachedLogos.splice(index, 1);
  }

  removeSignature(index: number) {
    this.attachedSignatures.splice(index, 1);
  }

  get attachedLogosData(): FormArray {
    return this.certificateForm.get('attachedLogos') as FormArray;
  }
  
  get attachedSignaturesData(): FormArray {
    return this.certificateForm.get('attachedSignatures') as FormArray;
  }

  onSubmit(): void {
    if (this.certificateForm.valid) {
      const formData = {
        ...this.certificateForm.value,
        attachedLogos: this.attachedLogos,
        attachedSignatures: this.attachedSignatures,
      };
      console.log('Form Data:', formData);
    } else {
      console.log('Form is invalid');
    }
  }
}