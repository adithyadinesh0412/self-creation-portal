import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  CommentsBoxComponent,
  DialogPopupComponent,
  FormService,
  ToastService,
  UtilService,
  projectMode,resourceStatus
} from 'lib-shared-modules';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LibProjectService } from '../../../lib-project.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lib-certificates',
  standalone: true,
  imports: [
    TranslateModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatInputModule,
    CommentsBoxComponent
  ],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss',
})
export class CertificatesComponent implements OnInit, OnDestroy{
  certificateDetails: any;
  selectedYes: any = "2";
  certificateForm!: FormGroup;
  attachLogo:any= [];
  attachSign:any = [];
  certificateTypeSelected:string|any = '';
  evidenceNumber = [1, 2, 3];
  mode: string = '';
  viewOnly: boolean = false;
  projectId: string | number = '';
  tasks:any; // only to render tasks in html page
  commentPayload: any;
  commentsList: any = [];
  svgContent = '';
  projectInReview: boolean = false;
  taskForm: any;
  certificateList:any = [];
  intervalId:any;
  certificate:any = {
      base_template_id: 1,
      base_template_url: "",
      code: "",
      name: "",
      logos: {
      no_of_logos: 1,
      stateLogo1: "",
      stateLogo2: ""
      },
      signature: {
        no_of_signature: 2,
        signatureImg1: "",
        signatureTitleName1: "",
        signatureTitleDesignation1: "",
        signatureImg2: "",
        signatureTitleName2: "",
        signatureTitleDesignation2: ""
      },
      issuer: "",
      criteria: {
        validationText: 'Complete validation message',
        expression: 'C1&&C2&&C3',
        conditions: {
          C1: {
            validationText: 'Project Should be submitted.',
            expression: 'C1',
            conditions: {
              C1: {
                scope: 'project',
                key: 'status',
                operator: '==',
                value: 'submitted',
              },
            },
          },
          C2: {
            validationText: 'Evidence project level validation',
            expression: 'C1',
            conditions: {
              C1: {
                scope: 'project',
                key: 'attachments',
                function: 'count',
                filter: {
                  key: 'type',
                  value: 'all',
                },
                operator: '>=',
                value: '',
              },
            },
          },
          C3: {
            validationText: 'Evidence task level validation',
            expression: 'C1&&C2&&C3',
            conditions: {},
          },
        },
      }
  }
  @ViewChild('certificateContainer', { static: false }) certificateContainer: ElementRef | any;

  private subscription: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private formService: FormService,
    public libProjectService: LibProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService,
    private renderer: Renderer2,
    private toastService:ToastService
  ) {}

  ngOnInit() {
    this.initForm();
    this.getCertificateList();
    if(this.mode === projectMode.EDIT || this.mode === "" || this.mode === projectMode.REQUEST_FOR_EDIT){
      this.subscription.add(
        this.libProjectService.isProjectSave.subscribe(
          (isProjectSave: boolean) => {
            if (isProjectSave && this.router.url.includes('certificate')) {
              this.libProjectService.updateProjectDraft(this.projectId).subscribe((res) =>console.log(res))
            }
          }
        )
      );
      this.subscription.add( // Check validation before sending for review.
        this.libProjectService.isSendForReviewValidation.subscribe(
          (reviewValidation: boolean) => {
            if(reviewValidation) {
              this.libProjectService.triggerSendForReview();
            }
          }
        )
      );
    }
    this.subscription.add(
      this.route.queryParams.subscribe((params: any) => {
        this.mode = params.mode;
        this.projectId = params.projectId;
        if (Object.keys(this.libProjectService.projectData)?.length) {
          if (params.mode === projectMode.EDIT || params.mode === projectMode.REQUEST_FOR_EDIT) {
            this.startAutoSaving();
            if(this.libProjectService.projectData.tasks) {
              this.tasks = this.libProjectService.projectData.tasks.filter((task:any) => {
                if(task.evidence_details.min_no_of_evidences) {
                  if(this.libProjectService.projectData.certificate && this.libProjectService.projectData.certificate.criteria) {
                    task.values = this.libProjectService.projectData.certificate.criteria.conditions.C3.conditions[task.id] ? this.libProjectService.projectData.certificate.criteria.conditions.C3.conditions[task.id].value : task.evidence_details.min_no_of_evidences
                  }
                  return task;
                }
              });
            }
            // set certificate data in parent project data when certificate data is not project
            if(!this.libProjectService.projectData.certificate) {
              this.selectedYes = "2"
            }
            else {
              this.certificate = this.libProjectService.projectData.certificate;
              this.selectedYes = "1"
            }
            this.getCertificateForm()
          }
          if (this.libProjectService?.projectData?.status == resourceStatus.IN_REVIEW) {
            this.getCommentConfigs();
          }
        } else {
          if(!this.projectId) {
            this.libProjectService
            .createOrUpdateProject({ ...this.libProjectService.projectData, ...{ title: 'Untitled project' } })
            .subscribe((res: any) => {
              (this.projectId = res.result.id),
                this.router.navigate([], {
                  relativeTo: this.route,
                  queryParams: {
                    projectId: this.projectId,
                    mode: projectMode.EDIT,
                  },
                  queryParamsHandling: 'merge',
                  replaceUrl: true,
                });
                this.libProjectService.projectData.id = res.result.id;
                this.getCertificateForm();
                if (params.mode === projectMode.EDIT || this.mode === projectMode.REQUEST_FOR_EDIT) {
                  this.startAutoSaving();
                }
                if (this.libProjectService?.projectData?.status == resourceStatus.IN_REVIEW) {
                  this.getCommentConfigs();
                }
            })

          }
          else {
            this.libProjectService
            .readProject(params.projectId)
            .subscribe((res: any) => {
              this.libProjectService.setProjectData(res.result);
              this.libProjectService.projectData = res?.result;
              if (this.libProjectService?.projectData?.status == resourceStatus.IN_REVIEW) {
                this.getCommentConfigs();
              }
              if(res.result.tasks) {
                this.tasks = res.result.tasks.filter((task:any) => {
                  if(task.evidence_details?.min_no_of_evidences) {
                    if(this.libProjectService.projectData.certificate && this.libProjectService.projectData.certificate.criteria && this.libProjectService.projectData.certificate.criteria.conditions.C3.conditions[task.id]) {
                      task.values = this.libProjectService.projectData.certificate.criteria.conditions.C3.conditions[task.id].value
                    }
                    return task;
                  }
                });
              }
              // set certificate data in parent project data when certificate data is not project
              if(!this.libProjectService.projectData.certificate) {
                this.selectedYes = "2"
              }
              else {
                this.certificate = this.libProjectService.projectData.certificate;
                this.selectedYes = "1"
                this.setIssuerName(this.libProjectService.projectData.certificate.issuer)
                this.certificateForm.patchValue({issuerName:this.libProjectService.projectData.certificate.issuer,evidenceRequired:this.libProjectService.projectData.certificate.criteria?.conditions?.C2?.conditions?.C1?.value})
                this.updateSignaturePreview()
                this.setLogoPreview();
                this.updateCertificatePreview('stateTitle',this.libProjectService.projectData.certificate.issuer,'text')
              }
              this.getCertificateForm();
              if (params.mode === projectMode.EDIT || this.mode === projectMode.REQUEST_FOR_EDIT) {
                this.startAutoSaving();
              }
            });
          }
        }
        if (
          params.mode === projectMode.VIEWONLY ||
          params.mode === projectMode.REVIEW ||
          params.mode === projectMode.REVIEWER_VIEW ||
          this.mode === projectMode.CREATOR_VIEW
        ) {
          this.viewOnly = true;
        }
      })
    );
  }

  setIssuerName(value:string) {
    this.libProjectService.projectData.certificate.issuer = value;
    this.updateCertificatePreview('stateTitle',value,'text')
  }


  getCertificateForm() {
    this.formService.getCertificateForm().then((data: any) => {
      if(this.tasks && this.libProjectService.projectData.certificate && this.tasks.length) {
        this.createCriteriaForTasks()
      }
      // Separate the removed items
      this.taskForm = data.controls.filter(
        (item: any) => item.scope === 'task'
      );
      // Keep the remaining items in the original array
      this.certificateDetails = data.controls.filter(
        (item: any) => item.scope !== 'task'
      );
      return data;
    });
  }

  certificateEnabling(value:string) {
    this.selectedYes = value;
    if(this.selectedYes == "2") {
      delete this.libProjectService.projectData.certificate
    }
    else {
      if(!this.libProjectService.projectData.certificate) {
        this.libProjectService.projectData.certificate = this.certificate
      }
    }
  }

  startAutoSaving() {
    this.subscription.add(
      this.subscription.add(
        this.libProjectService
        .startAutoSave(this.projectId)
        .subscribe((data) => console.log(data))
      )
    )
  }

  initForm() {
    this.certificateForm = this.fb.group({
      selectedOption: [''],
      certificateType: ['one_logo_one_sign', Validators.required],
      issuerName: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(/^(?! )(?!.* {3})[\p{L}a-zA-Z0-9\-_ <>&]+$/),
        ],
      ],
      evidenceRequired: ['1', Validators.required],
      enableProjectEvidence: [''],
      attachLogo: this.fb.array([]),
      attachSign: this.fb.array([]),
    });
  }

  getCertificateList() {
    this.libProjectService
      .getCertificatesList()
      .subscribe((res:any) => {
        this.certificateList = res.result.data
        this.certificateTypeSelected = res.result.data[0];
        if(this.libProjectService.projectData.certificate) {
          this.setCertificateData(this.libProjectService.projectData.certificate)
        }else {
          this.libProjectService.projectData.certificate = this.certificate
        }
        if(!this.libProjectService.projectData?.certificate?.base_template_url) {
          this.libProjectService.projectData.certificate.base_template_url = res.result.data[0].url;
          this.libProjectService.projectData.certificate.base_template_id = res.result.data[0].id;
        }
        this.certificateAddIntoHtml();
      });
  }

  setCertificateData(certificate:any) {
    this.certificateTypeSelected = this.certificateList.find((certificateItem:any) => certificateItem.id == certificate.base_template_id)
    this.certificateForm.patchValue({
      issuerName:certificate.issuer,
      certificateType:this.certificateTypeSelected.code
    })
  }

  openAttachment(link:string) {
    window.open(link,'_blank')
  }

  onCertificateTypeChange(value: string): void {
    console.log(value);
    this.certificateTypeSelected = this.certificateList.find((item:any) => item.code === value);
    this.libProjectService.projectData.certificate.base_template_url = this.certificateTypeSelected.url;
    this.libProjectService.projectData.certificate.base_template_id = this.certificateTypeSelected.id;
    this.certificateAddIntoHtml()
  }

  attachLogos(attachmentType:number) {
    const attachLogoData = this.certificateDetails.find(
      (field: any) => field.name === 'attachlogo'
    );
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      width: '39.375rem',
      disableClose: true,
      data: attachLogoData.dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.file) {
        this.utilService.getImageUploadUrl(result.file).subscribe((res:any) => {
          this.utilService.uploadSignedURL(result.file, res?.result?.certificate.files[0].url).subscribe((urlData:any) => {
            urlData = res.result.certificate.files[0].downloadableUrl;
            this.libProjectService.projectData.certificate.logos = {
              no_of_logos: this.certificateTypeSelected.meta.logos.no_of_logos,
              stateLogo1: attachmentType === 1 ? urlData:this.libProjectService.projectData.certificate.logos.stateLogo1,
              stateLogo2: attachmentType === 2 ? urlData:this.libProjectService.projectData.certificate.logos.stateLogo2,
            }
            this.setLogoPreview()
          })
        })
      }
    });
  }

  setLogoPreview() {
    this.updateCertificatePreview('stateLogo1',this.libProjectService.projectData.certificate?.logos?.stateLogo1,'image')
    this.updateCertificatePreview('stateLogo2',this.libProjectService.projectData.certificate?.logos?.stateLogo2,'image')
  }

  attachSignature(signatureType:number) {
    const attachSignData = this.certificateDetails.find(
      (field: any) => field.name === 'attachsign'
    );
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      width: '39.375rem',
      disableClose: true,
      data: attachSignData.dialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result.additionalData.inputfields.find((item:any) => item.value === "")?.value === "") {
        this.toastService.openSnackBar({message : "Please Add Signature name and Designation",class : 'error'})
        return;
      }
      if (result && result.file) {
        this.utilService.getImageUploadUrl(result.file).subscribe((res:any) => {
          this.utilService.uploadSignedURL(result.file, res?.result?.certificate.files[0].url).subscribe((urlData:any) => {
            urlData = res.result.certificate.files[0].downloadableUrl;
            this.libProjectService.projectData.certificate.signature = {
              no_of_signature: this.certificateTypeSelected.meta.signature.no_of_signature,
              signatureImg1: signatureType === 1 ? urlData:this.libProjectService.projectData.certificate.signature.signatureImg1,
              signatureTitleName1: signatureType === 1 ? result.additionalData.inputfields[0].value:this.libProjectService.projectData.certificate.signature.signatureTitleName1,
              signatureTitleDesignation1: signatureType === 1 ? result.additionalData.inputfields[1].value:this.libProjectService.projectData.certificate.signature.signatureTitleDesignation1,
              signatureImg2:signatureType === 2 ? urlData:this.libProjectService.projectData.certificate.signature.signatureImg2,
              signatureTitleName2: signatureType === 2 ? result.additionalData.inputfields[0].value:this.libProjectService.projectData.certificate.signature.signatureTitleName2,
              signatureTitleDesignation2: signatureType === 2 ? result.additionalData.inputfields[1].value:this.libProjectService.projectData.certificate.signature.signatureTitleDesignation2,
            }
            this.updateSignaturePreview()
          })
        })
      }
      else {
        this.toastService.openSnackBar({message : "Please Add Signature",class : 'error'})
      }
    });
  }

  updateSignaturePreview() {
    this.updateCertificatePreview('signatureTitle1a',this.libProjectService.projectData.certificate?.signature?.signatureTitleName1+", "+this.libProjectService.projectData.certificate?.signature?.signatureTitleDesignation1,'text')
    this.updateCertificatePreview('signatureTitle2a',this.libProjectService.projectData.certificate?.signature?.signatureTitleName2+", "+this.libProjectService.projectData.certificate?.signature?.signatureTitleDesignation2,'text')
    this.updateCertificatePreview('signatureImg1',this.libProjectService.projectData.certificate?.signature?.signatureImg1,'image')
    this.updateCertificatePreview('signatureImg2',this.libProjectService.projectData.certificate?.signature?.signatureImg2,'image')
  }

  getCommentConfigs() {
    this.subscription.add(
      this.route.data.subscribe((data: any) => {
        this.utilService.getCommentList(this.projectId).subscribe((commentListRes: any) => {
          const comments = commentListRes.result?.comments || [];
          const filteredComments = this.utilService.filterCommentByContext(comments, data.page);

          this.commentsList = this.commentsList.concat(filteredComments);
          this.commentPayload = data;
          this.projectInReview = this.mode === projectMode.REVIEW || this.mode === projectMode.REQUEST_FOR_EDIT;

          if ((this.mode ===  projectMode.REVIEW && comments.some((comment: any) => comment.status === resourceStatus.DRAFT)) || (this.mode === projectMode.REQUEST_FOR_EDIT && comments.length > 0)) {
            this.libProjectService.checkValidationForRequestChanges();
          }
        });
      })
    );
  }

  certificateAddIntoHtml() {
    this.utilService.downloadFiles(this.certificateTypeSelected.url).subscribe((res) => {
      this.svgContent = res;
      if (this.certificateContainer) {
        this.renderer.setProperty(
          this.certificateContainer.nativeElement,
          'innerHTML',
          res
        );

        const svgElement = this.certificateContainer.nativeElement.querySelector('svg');
        if (svgElement) {
          this.renderer.setStyle(svgElement, 'object-fit', 'contain');
          this.renderer.setStyle(svgElement, 'width', '100%');
        }
        this.updateSignaturePreview()
        this.setLogoPreview();
        this.updateCertificatePreview('stateTitle',this.libProjectService.projectData.certificate?.issuer,'text')
      }
    });
  }

  viewCertificate() {
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      width: 'auto',
      height: 'auto',
      panelClass: 'custom-class',
      disableClose: true,
      data: {...{header:"Certificate preview"},...{certificate:this.certificateContainer}},
    });
    dialogRef.afterClosed().subscribe((result) => {

    });
  }

  updateCertificatePreview(elementId:string,content:any,type:string) {
    const element = document.getElementById(elementId)
    if(content && element) {
      switch(type){
        case "text" : {
          element.textContent = content;
          break;
        }
        case "image" : {
          element.setAttribute('xlink:href',content);
          break;
        }
      }
    }
  }

  createCriteriaForTasks() {
    this.tasks.forEach((task:any) => {
      this.libProjectService.projectData.certificate.criteria.conditions.C3.expression = this.libProjectService.projectData.certificate.criteria.conditions.C3.expression ? this.libProjectService.projectData.certificate.criteria.conditions.C3.expression +'&&'+task.id : task.id
      this.libProjectService.projectData.certificate.criteria.conditions.C3.conditions[task.id] = {
        scope: 'task',
        key: 'attachments',
        function: 'count',
        filter: {
          key: 'type',
          value: 'all',
        },
        operator: '>=',
        value: task.evidence_details.min_no_of_evidences,
        taskDetails: [task.id],
      }
    });
    // set certificate data in parent project data when certificate data is not project
    // if(!this.libProjectService.projectData.certificate) {
    //   this.libProjectService.projectData.certificate = this.certificate
    // }
  }

  setEvidenceCriteriaValue(criterialValue:any,taskCriteria:any,item:any) {
    this.libProjectService.projectData.certificate.criteria.conditions.C3.conditions[item.id].value = taskCriteria > 0 ? criterialValue : 0;
  }

  setProjectEvidenceCriteriaValue(criterialValue:any) {
    this.libProjectService.projectData.certificate.criteria.conditions.C2.conditions.C1.value = criterialValue;
  }

  removeAttachments(type:string,index:number|string) {
    switch(type) {
      case "logo": {
        if(index == 1) {
          this.libProjectService.projectData.certificate.logos.stateLogo1 = ''
        }
        else {
          this.libProjectService.projectData.certificate.logos.stateLogo2 = ''
        }
        break;
      }
      case "signature": {
        if(index == 1) {
          this.libProjectService.projectData.certificate.signature.signatureImg1 = ''
          this.libProjectService.projectData.certificate.signature.signatureTitleName1 = ''
          this.libProjectService.projectData.certificate.signature.signatureTitleDesignation1 = ''
        }
        else {
          this.libProjectService.projectData.certificate.signature.signatureImg2 = ''
          this.libProjectService.projectData.certificate.signature.signatureTitleName2 = ''
          this.libProjectService.projectData.certificate.signature.signatureTitleDesignation2 = ''
        }
        break;
      }
    }
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

  getFileName(url:string) {
    let fileName =  url.substring(url.lastIndexOf('/') + 1)
    fileName = fileName.replace(/%20/g, ' '); // Replace all occurrences of %20 with a space
    return fileName;
  }

  saveComment(quillInput:any){
    if(quillInput){
        this.libProjectService.checkValidationForRequestChanges()
    }
  }

  ngOnDestroy(): void {
    this.libProjectService.validForm.certificates = "VALID";
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if(this.mode === projectMode.EDIT || this.mode === projectMode.REQUEST_FOR_EDIT){
      if(this.libProjectService.projectData.id) {
        this.libProjectService.createOrUpdateProject(this.libProjectService.projectData,this.projectId).subscribe((res)=> console.log(res))
      }
      this.libProjectService.saveProjectFunc(false);
    }
    this.subscription.unsubscribe();
  }
}
