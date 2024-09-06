import { Injectable } from '@angular/core';
import {
  HttpProviderService,
  PROJECT_DETAILS_PAGE,
  ReviewModelComponent,
  SUBMITTED_FOR_REVIEW,
  ToastService,
  UtilService,
  ROUTE_PATHS,
  resourceStatus, reviewStatus , projectMode
} from 'lib-shared-modules';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { ConfigService } from 'lib-shared-modules';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs/internal/observable/interval';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class LibProjectService {
  dataSubject = new BehaviorSubject<any>(null);
  currentProjectMetaData = this.dataSubject.asObservable();
  projectData: any = {};
  private saveProject = new BehaviorSubject<boolean>(false);
  isProjectSave = this.saveProject.asObservable();
  private sendForReviewValidation = new BehaviorSubject<boolean>(false);
  isSendForReviewValidation = this.sendForReviewValidation.asObservable();
  projectId: string | number = '';
  validForm = {
    projectDetails: 'INVALID',
    tasks: 'INVALID',
    subTasks: 'VALID',
    certificates: 'VALID',
  };
  viewOnly: boolean = false;
  mode: any = 'edit';
  projectConfig: any;
  instanceConfig: any;

  constructor(
    private httpService: HttpProviderService,
    private Configuration: ConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private toastService: ToastService,
    private dialog: MatDialog,
    private utilService: UtilService
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.mode = params.mode ? params.mode : 'edit';
    });
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  setProjectData(data: any) {
    this.projectData = { ...this.projectData, ...data };
  }

  saveProjectFunc(newAction: boolean) {
    this.saveProject.next(newAction);
  }

  checkSendForReviewValidation(newAction: boolean) {
    this.sendForReviewValidation.next(newAction);
  }

  updateProjectDraft(projectId: string | number) {
    return this.createOrUpdateProject(this.projectData, projectId).pipe(
      map((res: any) => {
        this.setProjectData(res.result);
        this.openSnackBarAndRedirect(res.message);
        this.saveProjectFunc(false);
        this.upDateProjectTitle();
        return res;
      })
    );
  }

  triggerSendForReview() {
    if (
      this.validForm.projectDetails === 'VALID' &&
      this.validForm.tasks === 'VALID' &&
      this.validForm.subTasks === 'VALID'
    ) {
      if (
        this.projectConfig.show_reviewer_list &&
        this.projectData.status !== resourceStatus.IN_REVIEW
      ) {
        this.getReviewerData().subscribe((list: any) => {
          const dialogRef = this.dialog.open(ReviewModelComponent, {
            disableClose: true,
            data: {
              header: 'SEND_FOR_REVIEW',
              reviewdata: list.result.data,
              sendForReview: 'SEND_FOR_REVIEW',
              note_length: this.instanceConfig.note_length
                ? this.instanceConfig.note_length
                : 200,
            },
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            if (result.sendForReview == 'SEND_FOR_REVIEW' && this.checkCertificateValidations()) {
              this.createOrUpdateProject(
                this.projectData,
                this.projectData.id
              ).subscribe((res) => {
                const reviewer_ids =
                  result.selectedValues.length === list.result.data.length
                    ? result.reviewerNote
                      ? { notes: result.reviewerNote }
                      : {}
                    : {
                        reviewer_ids: result.selectedValues.map(
                          (item: any) => item.id
                        ),
                        ...(result.reviewerNote && {
                          notes: result.reviewerNote,
                        }),
                      };
                this.sendForReview(reviewer_ids, this.projectData.id).subscribe(
                  (res: any) => {
                    let data = {
                      message: res.message,
                      class: 'success',
                    };
                    this.toastService.openSnackBar(data);
                    this.projectData = {};
                    this.router.navigate([SUBMITTED_FOR_REVIEW]);
                  }
                );
              });
            }
            return true;
          });
        });
      } else {
        this.getResolveComment().subscribe((res) => {
          this.utilService
            .updateComment(this.projectData.id, res)
            .subscribe((res: any) => {
              this.sendForReview({}, this.projectData.id).subscribe(
                (res: any) => {
                  this.toastService.openSnackBar({
                    message: res.message,
                    class: 'success',
                  });
                  this.projectData = {};
                  this.router.navigate([SUBMITTED_FOR_REVIEW]);
                }
              );
            });
        });
      }
    } else {
      this.openSnackBarAndRedirect('Fill all the mandatory fields.', 'error');
    }
    this.checkSendForReviewValidation(false);
  }

  createOrUpdateProject(projectData?: any, projectId?: string | number) {
    this.projectData.title =
      this.projectData?.title?.length > 0
        ? this.projectData.title
        : 'Untitled project';
    for (let key in projectData) {
      if (Array.isArray(projectData[key])) {
        projectData[key] = projectData[key].map((element: any) =>
          element.value ? element.value : element
        );
      }
      projectData[key] = projectData[key]?.value
        ? projectData[key].value
        : projectData[key];
    }
    const config = {
      url: projectId
        ? this.Configuration.urlConFig.PROJECT_URLS.CREATE_OR_UPDATE_PROJECT +
          '/' +
          projectId
        : this.Configuration.urlConFig.PROJECT_URLS.CREATE_OR_UPDATE_PROJECT,
      payload: projectData ? projectData : '',
    };
    return this.httpService.post(config.url, config.payload);
  }

  readProject(projectId: number | string) {
    return this.httpService.get(
      this.Configuration.urlConFig.PROJECT_URLS.READ_PROJECT + projectId
    );
  }

  checkCertificateValidations() {
    if(this.projectData.certificate) {
      if (this.projectData.certificate && this.projectData?.certificate?.issuer === '') {
        this.validForm.certificates = "INVALID"
        this.toastService.openSnackBar({
          message: 'Please fill issuer Name',
          class: 'error',
        });
        return false;
      }
      if (
        !this.projectData.certificate.logos.no_of_logos ||
        (this.projectData.certificate.logos.no_of_logos > 0 &&
          this.projectData.certificate.logos.stateLogo1 === '') ||
        (this.projectData.certificate.logos.no_of_logos > 1 &&
          this.projectData.certificate.logos.stateLogo2 === '')
      ) {
        this.validForm.certificates = "INVALID"
        this.toastService.openSnackBar({
          message: 'Please upload certificate logo',
          class: 'error',
        });
        return false;
      }

      if (!this.projectData.certificate.signature.no_of_signature ||
        (this.projectData.certificate.signature.no_of_signature > 0 &&
          this.projectData.certificate.logos.signatureImg1 === '') ||
        (this.projectData.certificate.signature.no_of_signature > 1 &&
          this.projectData.certificate.logos.signatureImg2 === '')) {
            this.validForm.certificates = "INVALID"
        this.toastService.openSnackBar({
          message: 'Please upload certificate Signature',
          class: 'error',
        });
        return false;
      }
      return true;
    }
    else {
      return true;
    }
  }

  // Getting form from api
  getForm(formBody: any) {
    const config = {
      url: this.Configuration.urlConFig.FORM_URLS.READ_FORM,
      payload: formBody,
    };
    return this.httpService.post(config.url, config.payload);
  }

  openSnackBarAndRedirect(
    message?: string,
    panelClass?: string,
    url: any = ''
  ) {
    let data = {
      message: message ? message : 'YOUR_RESOURCE_HAS_BEEN_SAVED_AS_DRAFT',
      class: panelClass ? panelClass : 'success',
    };
    this.toastService.openSnackBar(data);
    if (url?.length) {
      this.router.navigate([`/home/${url}`]);
    }
  }

  upDateProjectTitle(title?: string) {
    const currentProjectMetaData = this.dataSubject.getValue();
    const updatedData = {
      ...currentProjectMetaData,
      sidenavData: {
        ...currentProjectMetaData.sidenavData,
        headerData: {
          ...currentProjectMetaData.sidenavData.headerData,
          title: title
            ? title
            : this.projectData?.title
            ? this.projectData?.title
            : 'PROJECT_NAME',
        },
      },
    };
    this.setData(updatedData);
  }

  deleteProject(projectId: number | string) {
    const config = {
      url: `${this.Configuration.urlConFig.PROJECT_URLS.CREATE_OR_UPDATE_PROJECT}/${projectId}`,
    };
    return this.httpService.delete(config.url);
  }

  getReviewerData() {
    const config = {
      url: this.Configuration.urlConFig.PROJECT_URLS.GET_REVIEWER_LIST,
    };
    return this.httpService.get(config.url);
  }

  setConfig() {
    const config = {
      url: this.Configuration.urlConFig.INSTANCES.CONFIG_LIST,
    };
    return this.httpService.get(config.url);
  }

  sendForReview(reviewers: any, projectId: any) {
    const config = {
      url: `${this.Configuration.urlConFig.PROJECT_URLS.SEND_FOR_REVIEW}/${projectId}`,
      payload: reviewers,
    };

    return this.httpService.post(config.url, config.payload);
  }

  startAutoSave(projectID: string | number) {
    return interval(
      this.instanceConfig.auto_save_interval
        ? this.instanceConfig.auto_save_interval
        : 30000
    ).pipe(
      switchMap(() => {
        return this.createOrUpdateProject(
          this.projectData,
          this.projectData.id
        );
      })
    );
  }

  approveProject() {
    this.getcommentsListAsOpen().subscribe((res) => {
      this.utilService
        .approveResource(this.projectData.id, { comment: res })
        .subscribe((res: any) => {
          this.openSnackBarAndRedirect(
            res.message,
            'success',
            ROUTE_PATHS.SIDENAV.UP_FOR_REVIEW
          );
        });
    });
  }

  startOrResumeReview() {
    this.utilService
      .startOrResumeReview(this.projectData.id)
      .subscribe((data) => {});
    this.router.navigate([PROJECT_DETAILS_PAGE], {
      queryParams: {
        projectId: this.projectData.id,
        mode: projectMode.REVIEW,
      },
    });
  }

  editProject() {
    if(this.projectData.status === resourceStatus.IN_REVIEW){
      this.router.navigate([PROJECT_DETAILS_PAGE], {
        queryParams: {
          projectId: this.projectData.id,
          mode: projectMode.REQUEST_FOR_EDIT
        }
      });
    }else{
      this.router.navigate([PROJECT_DETAILS_PAGE], {
        queryParams: {
          projectId: this.projectData.id,
          mode: projectMode.EDIT
        },
      });
    }

  }

  rejectProject(reason: any, isReported: any) {
    this.utilService
      .rejectOrReportedReview(
        this.projectData.id,
        reason ? { notes: reason } : {},
        isReported
      )
      .subscribe((res: any) => {
        this.openSnackBarAndRedirect(
          res.message,
          'success',
          ROUTE_PATHS.SIDENAV.UP_FOR_REVIEW
        );
      });
  }

  sendForRequestChange() {
    this.utilService.saveComment = false;
    this.getcommentsListAsOpen().subscribe((res) => {
      this.utilService
        .updateReview(this.projectData.id, { comment: res })
        .subscribe((data: any) => {
          this.openSnackBarAndRedirect(
            data.message,
            'success',
            ROUTE_PATHS.SIDENAV.UP_FOR_REVIEW
          );
        });
    });
  }

  checkValidationForRequestChanges() {
    const currentProjectMetaData = this.dataSubject.getValue();
    if (
      Array.isArray(
        currentProjectMetaData?.sidenavData.headerData?.buttons?.[this.mode]
      )
    ) {
      currentProjectMetaData?.sidenavData.headerData?.buttons?.[
        this.mode
      ].forEach((element: any) => {
        if (element.title === 'REQUEST_CHANGES') {
          element.disable = false;
        }
      });
    }
  }

  getCertificatesList() {
    return this.httpService.get(this.Configuration.urlConFig.CERTIFICATE.LIST);
  }

  getResolveComment(): Observable<any> {
    const userId = localStorage.getItem('id');
    return this.getComments().pipe(
      map((comments: any[]) => {
        comments.forEach((comment: any) => {
          if (comment?.commenter.id !== userId) {
            // comment.status = 'RESOLVED';
          } else {
            comment.status = 'OPEN';
          }
        });
        return comments;
      })
    );
  }

  getcommentsListAsOpen(): Observable<any> {
    return this.getComments().pipe(
      map((comments: any[]) => {
        comments.forEach((comment: any) => {
          if (comment.status === resourceStatus.DRAFT) {
            comment.status = 'OPEN';
          }
        });
        return comments;
      })
    );
  }

  getComments(): Observable<any[]> {
    return this.utilService
      .getCommentList(this.projectData.id)
      .pipe(map((response: any) => response.result.comments || []));
  }
}
