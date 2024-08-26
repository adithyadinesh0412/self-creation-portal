import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogPopupComponent, FormService } from 'lib-shared-modules';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'lib-certificates',
  standalone: true,
  imports: [TranslateModule, MatIconModule, MatRadioModule, MatSelectModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, CommonModule, MatDialogModule, MatInputModule],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent implements OnInit{
  certificateDetails : any;
  certificateForm !: FormGroup 
  attachLogo: Array<{ name: string }> = [];
  attachSign: Array<{ name: string }> = [];
  certificateTypeSelected = false;
  filespecifications = [
    { no: '1', option: "HEIGHT_SPECIFICATION" },
    { no: '2', option: "SIZE_SPECIFICATIION" },
    { no: '3', option: "FILE_SPECIFICATION" } 
  ]
  evidenceNumber = [1, 2, 3];

  constructor(private dialog : MatDialog, private fb: FormBuilder, private formService: FormService,){}

  ngOnInit() {
    this.initForm();
    this.getCertificateForm();
  }

  initForm() {
    this.certificateForm = this.fb.group({
      selectedOption: [''],
      certificateType: ['', Validators.required],
      issuerName: ['', [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(/^(?! )(?!.* {3})[\p{L}a-zA-Z0-9\-_ <>&]+$/)
      ]
      ],
      evidenceRequired: ['', Validators.required],
      enableTaskEvidence: [''],
      attachLogo: this.fb.array([]),
      attachSign: this.fb.array([])
    });
  }

  onCertificateTypeChange(value: string): void {
    this.certificateTypeSelected = !!value;
  }

  attachLogos(){
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      disableClose: true,
      data : {
        header: "ATTACH_LOGO",
        subheader: "ATTACH_LOGOS_DETAIlS",
        subcontent: this.filespecifications,
        attachButton: "ATTACH"
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.fileName) {
        this.attachLogo.push({ name: result.fileName });
      } 
    })
  }

  attachSignature(){
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      disableClose: true,
      data : {
        header: "ATTACH_SIGNATURE",
        subheader: "ADD_SIGNATURE_DETALS",
        inputfields: [
          { label: "SIGNATURE_NAME", value: "", type: "text" },
          { label: "SIGNATURE_DESIGNATION", value: "" , type: "text" },
        ],
        subcontent: this.filespecifications,
        attachButton: "ATTACH"
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.fileName) {
        this.attachSign.push({ name: result.fileName });
      } 
    })
  }

  removeLogo(index: number) {
    this.attachLogo.splice(index, 1);
  }

  removeSignature(index: number) {
    this.attachSign.splice(index, 1);
  }

  get attachedLogosData(): FormArray {
    return this.certificateForm.get('attachedLogos') as FormArray;
  }
  
  get attachedSignaturesData(): FormArray {
    return this.certificateForm.get('attachedSignatures') as FormArray;
  }

  onSubmit(): void {
    this.certificateForm.markAllAsTouched();
    if (this.certificateForm.valid) {
      const formData = {
        ...this.certificateForm.value,
        attachLogo: this.attachLogo,
        attachSign: this.attachSign,
      };
      console.log('Form Data:', formData);
    } else {
      console.log('Form is invalid');
    }
  }

  getCertificateForm(){
    this.formService.getCertificateForm().then((data : any) => {
      this.certificateDetails = data.controls
      return data
    })
  }
}