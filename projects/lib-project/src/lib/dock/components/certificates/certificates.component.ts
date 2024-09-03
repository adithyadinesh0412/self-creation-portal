import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  DialogPopupComponent,
  FormService,
  UtilService,
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
  ],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss',
})
export class CertificatesComponent implements OnInit {
  certificateDetails: any;
  selectedYes: any = "2";
  certificateForm!: FormGroup;
  attachLogo:any= [];
  attachSign:any = [];
  certificateTypeSelected:string|any = '';
  evidenceNumber = [1, 2, 3];
  mode: string = '';
  viewOnly: boolean = true;
  projectId: string | number = '';
  tasks:any; // only to render tasks in html page
  commentPayload: any;
  commentsList: any = [];
  svgContent = '';
  projectInReview: boolean = false;
  taskForm: any;
  certificateList:any = [];
  certificate:any = {
      base_template_id: 5,
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
      issuer: "SPD",
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
                value: 4,
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
  credentialSubject = {
    recipientName:"Ramkumar"
  }
  @ViewChild('certificateContainer', { static: true }) certificateContainer: ElementRef | any;

  private subscription: Subscription = new Subscription();
  private autoSaveSubscription: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private formService: FormService,
    private libProjectService: LibProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.initForm();
    this.getCertificateList();
    this.subscription.add(
      this.route.queryParams.subscribe((params: any) => {
        this.mode = params.mode;
        this.projectId = params.projectId;
        if (Object.keys(this.libProjectService.projectData)?.length) {
          if (params.mode === 'edit') {
            this.startAutoSaving();
          }
          if (this.libProjectService?.projectData?.status == 'IN_REVIEW') {
            this.getCommentConfigs();
          }
        } else {
          this.libProjectService
            .readProject(params.projectId)
            .subscribe((res: any) => {
              this.libProjectService.setProjectData(res.result);
              this.libProjectService.projectData = res?.result;
              this.tasks = res.result.tasks.filter((task:any) => {
                if(task.evidence_details.min_no_of_evidences) {
                  return task;
                }
              });
              // set certificate data in parent project data when certificate data is not project
              if(!this.libProjectService.projectData.certificate) {
                this.libProjectService.projectData.certificate = this.certificate
              }
              this.getCertificateForm();
              if (params.mode === 'edit') {
                this.startAutoSaving();
              }
            });
        }

        if (params.mode === 'edit') {
          this.subscription.add(
            this.libProjectService.isProjectSave.subscribe(
              (isProjectSave: boolean) => {
                if (isProjectSave && this.router.url.includes('sub-tasks')) {
                  this.submit();
                }
              }
            )
          );
          this.subscription.add(
            // Check validation before sending for review.
            this.libProjectService.isSendForReviewValidation.subscribe(
              (reviewValidation: boolean) => {
                if (reviewValidation) {
                  this.certificateForm.markAllAsTouched();
                  // this.libProjectService.validForm.subTasks =  this.subtasks?.status? this.subtasks?.status: "INVALID"
                  this.libProjectService.triggerSendForReview();
                }
              }
            )
          );
        }
        if (
          params.mode === 'viewOnly' ||
          params.mode === 'review' ||
          params.mode === 'reviewerView' ||
          this.mode === 'creatorView'
        ) {
          this.viewOnly = true;
        }
      })
    );
    this.getProjectDetails();
  }

  getCertificateForm() {
    this.formService.getCertificateForm().then((data: any) => {
      this.createCriteriaForTasks()
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
  }

  startAutoSaving() {
    this.subscription.add(
      this.libProjectService
        .startAutoSave(this.projectId)
        .subscribe((data) => console.log(data))
    );
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
      .subscribe((res:any) => this.certificateList = res.result.data);
  }

  onCertificateTypeChange(value: string): void {
    console.log(value);
    this.certificateTypeSelected = this.certificateList.find((item:any) => item.code === value);
    this.getProjectDetails()
  }

  attachLogos() {
    const attachLogoData = this.certificateDetails.find(
      (field: any) => field.name === 'attachlogo'
    );
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      disableClose: true,
      data: attachLogoData.dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.fileName) {
        this.attachLogo.push({ name: result.fileName });
      }
    });
  }

  attachSignature() {
    const attachSignData = this.certificateDetails.find(
      (field: any) => field.name === 'attachsign'
    );
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      disableClose: true,
      data: attachSignData.dialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.file) {
        this.utilService.getImageUploadUrl(result.file).subscribe((res) => {
          console.log(res);
          this.attachSign.push(res);
        })
      }
    });
  }

  getCommentConfigs() {
    this.subscription.add(
      this.route.data.subscribe((data: any) => {
        this.utilService
          .getCommentList(this.projectId)
          .subscribe((commentListRes: any) => {
            this.commentsList = this.commentsList.concat(
              this.utilService.filterCommentByContext(
                commentListRes.result.comments,
                data.page
              )
            );
            this.commentPayload = data;
            this.projectInReview = true;
            if (commentListRes.result?.comments?.length > 0) {
              this.libProjectService.checkValidationForRequestChanges();
            }
          });
      })
    );
  }

  getProjectDetails() {
    this.utilService.downloadFiles(this.certificateTypeSelected.url).subscribe((res) => {
      console.log(res);
      // this.svgContent = res;
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
      }
    });
  }

  viewCertificate() {

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
    console.log(criterialValue,taskCriteria,item)
    this.libProjectService.projectData.certificate.criteria.conditions.C3.conditions[item.id].value = taskCriteria > 0 ? criterialValue : 0;
    console.log(this.libProjectService.projectData.certificate)
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

  submit(): void {
    this.getProjectDetails();
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
}
