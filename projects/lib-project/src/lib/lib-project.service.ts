import { Injectable } from '@angular/core';
import { HttpProviderService } from 'lib-shared-modules';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { ConfigService } from 'lib-shared-modules'
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs/internal/observable/interval';


@Injectable({
  providedIn: 'root'
})
export class LibProjectService {
  dataSubject = new BehaviorSubject<any>(null);
  currentProjectMetaData = this.dataSubject.asObservable();
  projectData:any = {}
  private saveProject = new BehaviorSubject<boolean>(false);
  isProjectSave = this.saveProject.asObservable();
  projectId:string|number='';
  maxTaskCount:number=0
  validForm={
    projectDetails: "INVALID",
    tasks:"INVALID"
  }

  constructor(private httpService:HttpProviderService, private Configuration:ConfigService, private route:ActivatedRoute,private router:Router, private _snackBar:MatSnackBar) {
    this.route.queryParams.subscribe((params: any) => {
      console.log("project service file")
    })
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  setProjectData(data: any) {
    this.projectData = {...this.projectData,...data}
    console.log(this.projectData);
  }

  saveProjectFunc(newAction: boolean) {
    this.saveProject.next(newAction);
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

  createOrUpdateProject(projectData?:any,projectId?:string|number) {
    const config = {
      url: projectId ? this.Configuration.urlConFig.PROJECT_URLS.CREATE_OR_UPDATE_PROJECT+'/'+projectId : this.Configuration.urlConFig.PROJECT_URLS.CREATE_OR_UPDATE_PROJECT,
      payload: projectId ? projectData : {title:'Untitled project'}
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

  openSnackBar() {
    this._snackBar.open('Your resource has been saved as draft', 'X', {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration:1000
    });
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

  deleteProject(projectId:number|string,projectData:any){
    const config = {
      url : `${this.Configuration.urlConFig.PROJECT_URLS.DELETE_PROJECT}/${projectId}`,
      payload :  projectData ? projectData : { title: 'Untitled project' }
    };
    return this.httpService.delete(config.url, { body: config.payload }).pipe(
      map((result : any) => {
        console.log('Delete project successsfully', result);
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
        console.log(result)
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
        console.log(result)
        return result;
      })
    )
  }

  sendForReview(reviewers:any,projectId:any){
    const config = {
       url : `${this.Configuration.urlConFig.PROJECT_URLS.SEND_FOR_REVIEW}/${projectId}`,
       payload:{ "reviwer_ids" : reviewers }
    };

    return this.httpService.post(config.url, config.payload).pipe(
      map((result: any) => {
        return result;
      })
    )

  }

  checkValidationForSubmit(){
    const currentProjectMetaData = this.dataSubject.getValue();
    currentProjectMetaData?.sidenavData.headerData.buttons.forEach((element:any) => {
      if(element.title == "SEND_FOR_REVIEW"){
        if(this.validForm.projectDetails == "VALID" && this.validForm.tasks == "VALID"){
          element.disable = false;
        }else{
          element.disable = true;
        }
      }
    });
  }

  startAutoSave(projectID:string|number) {
    return interval(30000).pipe(
      switchMap(() => {
        return this.updateProjectDraft(projectID);
      })
    );
  }
}
