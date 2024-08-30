import { Component, OnInit } from '@angular/core';
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
  selectedYes: any;
  certificateForm!: FormGroup;
  attachLogo: Array<{ name: string }> = [];
  attachSign: Array<{ name: string }> = [];
  certificateTypeSelected = false;
  evidenceNumber = [1, 2, 3];
  mode: string = '';
  viewOnly: boolean = true;
  projectId: string | number = '';
  projectData: any;
  commentPayload: any;
  commentsList: any = [];
  projectInReview: boolean = false;
  taskForm: any;
  taskCriteria:any =  {
    scope: 'task',
    key: 'attachments',
    function: 'count',
    filter: {
      key: 'type',
      value: 'all',
    },
    operator: '>=',
    value: 1,
    taskDetails: [],
  }
  criteria: any = {
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
        conditions: {
          C1: {
            scope: 'task',
            key: 'attachments',
            function: 'count',
            filter: {
              key: 'type',
              value: 'all',
            },
            operator: '>=',
            value: 2,
            taskDetails: ['63c534e8fc54e000088c3d30'],
          },
          C2: {
            scope: 'task',
            key: 'attachments',
            function: 'count',
            filter: {
              key: 'type',
              value: 'all',
            },
            operator: '>=',
            value: 2,
            taskDetails: ['63c534e8fc54e000088c3d31'],
          },
          C3: {
            scope: 'task',
            key: 'attachments',
            function: 'count',
            filter: {
              key: 'type',
              value: 'all',
            },
            operator: '>=',
            value: 2,
            taskDetails: ['63c534e8fc54e000088c3d2'],
          }
        },
      },
    },
  };
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
  ) {}

  ngOnInit() {
    this.initForm();
    this.getCertificateList();
    this.subscription.add(
      this.route.queryParams.subscribe((params: any) => {
        this.mode = params.mode;
        this.projectId = params.projectId;
        if (Object.keys(this.libProjectService.projectData)?.length) {
          this.projectData = this.libProjectService.projectData;
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
              this.projectData = res?.result;
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
  }

  getCertificateForm() {
    this.formService.getCertificateForm().then((data: any) => {
      // Separate the removed items
      this.taskForm = data.controls.filter(
        (item: any) => item.scope === 'task'
      );
      // Keep the remaining items in the original array
      this.certificateDetails = data.controls.filter(
        (item: any) => item.scope !== 'task'
      );
      this.selectedYes = this.certificateDetails
        .find((field: any) => field.name === 'addcertificate')
        ?.options.find((option: any) => option.label === 'Yes')?.value;
      return data;
    });
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
      certificateType: ['', Validators.required],
      issuerName: [
        '',
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(/^(?! )(?!.* {3})[\p{L}a-zA-Z0-9\-_ <>&]+$/),
        ],
      ],
      evidenceRequired: ['', Validators.required],
      enableProjectEvidence: ['1'],
      attachLogo: this.fb.array([]),
      attachSign: this.fb.array([]),
    });
  }

  getCertificateList() {
    this.libProjectService
      .getCertificatesList()
      .subscribe((res) => console.log(res));
  }

  onCertificateTypeChange(value: string): void {
    this.certificateTypeSelected = !!value;
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
        })
        this.attachSign.push({ name: result.file });
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

  setEvidenceCriteriaValue(criterialValue:any,taskCriteria:any,item:any) {
    let criteria;
    console.log(criterialValue,taskCriteria,item)
    for (let key in this.criteria.C3.conditions) {
      if (this.criteria.C3.conditions[key].taskDetails && this.criteria.C3.conditions[key].taskDetails.includes(item.id)) {
        criteria = this.criteria.C3.conditions[key]
        delete this.criteria.C3.conditions[key]; // Remove the item if taskDetails matches the target
        break; // Exit loop since we found and removed the item
      }
    }
    if(taskCriteria) {

    }
    else {

    }
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
