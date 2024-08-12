import { Injectable } from '@angular/core';
import { HttpProviderService, ReviewModelComponent, SUBMITTED_FOR_REVIEW, ToastService } from 'lib-shared-modules';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { ConfigService } from 'lib-shared-modules'
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs/internal/observable/interval';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class LibProjectService {
  dataSubject = new BehaviorSubject<any>(null);
  currentProjectMetaData = this.dataSubject.asObservable();
  projectData:any = {}
  private saveProject = new BehaviorSubject<boolean>(false);
  isProjectSave = this.saveProject.asObservable();
  private sendForReviewValidation = new BehaviorSubject<boolean>(false);
  isSendForReviewValidation = this.sendForReviewValidation.asObservable();
  projectId:string|number='';
  validForm={
    projectDetails: "INVALID",
    tasks:"INVALID",
    subTasks:"VALID",
    certificates:"VALID"
  }
  viewOnly:boolean= false;
  mode:any="edit"
  projectConfig:any
  instanceConfig:any

  constructor(private httpService:HttpProviderService, private Configuration:ConfigService, private route:ActivatedRoute,private router:Router, private _snackBar:MatSnackBar,private toastService:ToastService,private dialog : MatDialog) {
    this.route.queryParams.subscribe((params: any) => {
      this.mode = params.mode ? params.mode : "edit"
    })
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  setProjectData(data: any) {
    this.projectData = {...this.projectData,...data}
  }

  saveProjectFunc(newAction: boolean) {
    this.saveProject.next(newAction);
  }

  checkSendForReviewValidation(newAction: boolean) {
    this.sendForReviewValidation.next(newAction);
  }

  updateProjectDraft(projectId:string|number) {
    return this.createOrUpdateProject(this.projectData, projectId).pipe(
      map((res: any) => {
        this.setProjectData(res.result);
        this.openSnackBar();
        this.saveProjectFunc(false);
        this.upDateProjectTitle();
        return res;
      })
    );
  }

  triggerSendForReview() {
    if(this.validForm.projectDetails === "VALID" && this.validForm.tasks === "VALID" &&this.validForm.subTasks === "VALID") {
      if(this.projectConfig.show_reviewer_list){
        this.getReviewerData().subscribe((list:any) =>{
          const dialogRef = this.dialog.open(ReviewModelComponent, {
            disableClose: true,
            data : {
              header: "SEND_FOR_REVIEW",
              reviewdata: list.result.data,
              sendForReview: "SEND_FOR_REVIEW",
              note_length: this.instanceConfig.note_length ? this.instanceConfig.note_length : 200
            }
          });
          dialogRef.afterClosed().subscribe((result:any) => {
            if(result.sendForReview == "SEND_FOR_REVIEW"){
              this.createOrUpdateProject(this.projectData,this.projectData.id).subscribe((res) => {
              const reviewer_ids = (result.selectedValues.length === list.result.data.length)  ? (result.reviewerNote  ? { "notes": result.reviewerNote }   : {})  : {"reviewer_ids": result.selectedValues.map((item: any) => item.id), ...(result.reviewerNote && { "notes": result.reviewerNote }) };
              this.sendForReview(reviewer_ids,this.projectData.id).subscribe((res:any) =>{
                let data = {
                  message : res.message,
                  class : 'success'
                }
                this.toastService.openSnackBar(data)
                this.projectData = {};
                this.router.navigate([SUBMITTED_FOR_REVIEW]);
              })
            })
            }
            return true;
          });
        })
      }else{
        this.sendForReview({},this.projectData.id).subscribe((res:any) =>{
          this.router.navigate([SUBMITTED_FOR_REVIEW]);
        })
      }
    }
    else {
      this.openSnackBar("Fill all the mandatory fields.","error")
    }
    this.checkSendForReviewValidation(false);
  }

  createOrUpdateProject(projectData?:any,projectId?:string|number) {
    this.projectData.title = this.projectData?.title?.length > 0 ? this.projectData.title :'Untitled project';
    for (let key in projectData) {
      if(Array.isArray(projectData[key])) {
        projectData[key] = projectData[key].map((element:any) =>  element.value ? element.value : element)
      }
      projectData[key]= projectData[key]?.value ? projectData[key].value : projectData[key];
    }
    const config = {
      url: projectId ? this.Configuration.urlConFig.PROJECT_URLS.CREATE_OR_UPDATE_PROJECT+'/'+projectId : this.Configuration.urlConFig.PROJECT_URLS.CREATE_OR_UPDATE_PROJECT,
      payload: projectData ? projectData : ''
    };
    return this.httpService.post(config.url, config.payload);
  }

  readProject(projectId:number|string) {
    return this.httpService.get(this.Configuration.urlConFig.PROJECT_URLS.READ_PROJECT+projectId);
  }

  // Getting form from api
  getForm(formBody: any) {
    const config = {
      url: this.Configuration.urlConFig.FORM_URLS.READ_FORM,
      payload: formBody,
    };
    return this.httpService.post(config.url, config.payload).pipe(
      map((result: any) => {
        return result;
      })
    )
  }

  openSnackBar(message?:string,panelClass?:string) {
    let data = {
      "message": message ? message : 'YOUR_RESOURCE_HAS_BEEN_SAVED_AS_DRAFT',
      "class": panelClass ? panelClass :"success",
    }
   this.toastService.openSnackBar(data)
  }

  upDateProjectTitle(title?:string){
      const currentProjectMetaData = this.dataSubject.getValue();
      const updatedData = {
        ...currentProjectMetaData,
        sidenavData: {
          ...currentProjectMetaData.sidenavData,
          headerData: {
            ...currentProjectMetaData.sidenavData.headerData,
            title: title ? title : ((this.projectData?.title)? this.projectData?.title: 'PROJECT_NAME')
          }
        }
      };
      this.setData(updatedData);
  }

  deleteProject(projectId:number|string){
    const config = {
      url : `${this.Configuration.urlConFig.PROJECT_URLS.CREATE_OR_UPDATE_PROJECT}/${projectId}`
    };
    return this.httpService.delete(config.url).pipe(
      map((result : any) => {
        return result;
      })
    );
  }

  getReviewerData(){
    const config = {
      url: this.Configuration.urlConFig.PROJECT_URLS.GET_REVIEWER_LIST,
    };
    return this.httpService.get(config.url).pipe(
      map((result: any) => {
        return result;
      })
    )
  }

  setConfig(){
    const config = {
      url: this.Configuration.urlConFig.INSTANCES.CONFIG_LIST,
    };
    return this.httpService.get(config.url).pipe(
      map((result: any) => {
        return result;
      })
    )
  }

  sendForReview(reviewers:any,projectId:any){
    const config = {
       url : `${this.Configuration.urlConFig.PROJECT_URLS.SEND_FOR_REVIEW}/${projectId}`,
       payload:reviewers
    };

    return this.httpService.post(config.url, config.payload)
  }

  startAutoSave(projectID:string|number) {
    return interval(this.instanceConfig.auto_save_interval ? this.instanceConfig.auto_save_interval : 30000).pipe(
      switchMap(() => {
        return this.createOrUpdateProject(this.projectData, this.projectData.id);
      })
    );
  }

  updateComment(){
    const config = {
      url : `${this.Configuration.urlConFig.PROJECT_URLS.UPDATE_COMMENT}}`,
      payload:{}
    };
    return this.httpService.post(config.url, config.payload).pipe(
      map((result: any) => {
        return result;
      })
    );
  }

  getCommentList(){
    const config = {
      url : `${this.Configuration.urlConFig.PROJECT_URLS.COMMENT_LIST}}`,
    };
    return this.httpService.get(config.url).pipe(
      map((result: any) => {
        return result;
      })
    );
  }

}
