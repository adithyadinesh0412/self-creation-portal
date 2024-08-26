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
  selectedYes:any;
  certificateForm !: FormGroup 
  attachLogo: Array<{ name: string }> = [];
  attachSign: Array<{ name: string }> = [];
  certificateTypeSelected = false;
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
    const attachLogoData = this.certificateDetails.find((field: any) => field.name === 'attachlogo');
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      disableClose: true,
      data: attachLogoData.dialogData 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.fileName) {
        this.attachLogo.push({ name: result.fileName });
      }
    });
  }

  attachSignature(){
    const attachSignData = this.certificateDetails.find((field: any) => field.name === 'attachsign');
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      disableClose: true,
      data: attachSignData.dialogData
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

  getAttachedData(controlName: string): FormArray {
    return this.certificateForm.get(controlName) as FormArray;
  }

  get attachedLogosData(): FormArray {
    return this.getAttachedData('attachedLogos');
  }
  
  get attachedSignaturesData(): FormArray {
    return this.getAttachedData('attachedSignatures');
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
      this.selectedYes = this.certificateDetails
      .find((field: any) => field.name === 'addcertificate')
      ?.options.find((option: any) => option.label === 'Yes')?.value;
      return data
    })
  }

}