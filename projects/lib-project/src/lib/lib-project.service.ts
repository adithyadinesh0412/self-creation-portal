import { Injectable } from '@angular/core';
import { HttpProviderService } from 'lib-shared-modules';
import { BehaviorSubject, map } from 'rxjs';
import { ConfigService } from 'lib-shared-modules'
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


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
    projectDetails: false,
    tasks:false
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
    this.createOrUpdateProject(this.projectData,projectId).subscribe((res:any) => {
      console.log(res.result);
      this.setProjectData(res.result);
      this.openSnackBar()
      this.saveProjectFunc(false);
      this.upDateProjectTitle();
    })
  }

  createOrUpdateProject(projectData?:any,projectId?:string|number) {
    const config = {
      url: projectId ? this.Configuration.urlConFig.PROJECT_URLS.CREATE_OR_UPDATE_PROJECT+'/'+projectId : this.Configuration.urlConFig.PROJECT_URLS.CREATE_OR_UPDATE_PROJECT,
      payload: projectId ? projectData : ''
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

  upDateProjectTitle(){
      const currentProjectMetaData = this.dataSubject.getValue();
      const updatedData = {
        ...currentProjectMetaData,
        sidenavData: {
          ...currentProjectMetaData.sidenavData,
          headerData: {
            ...currentProjectMetaData.sidenavData.headerData,
            title: (this.projectData?.title)? this.projectData?.title: 'PROJECT_NAME'
          }
        }
      };
      this.setData(updatedData);
  }

  deleteProject(projectId:number|string){
    return this.httpService.delete(this.Configuration.urlConFig.PROJECT_URLS.DELETE_PROJECT+projectId);
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

  sendForReview(reviewers:any){
   let reviewer = {
     "reviwer_ids" : reviewers
   }
    const config = {
      url: this.Configuration.urlConFig.PROJECT_URLS.SEND_FOR_REVIEW,
      payload:[reviewer]
    };

    return this.httpService.post(config.url, config.payload).pipe(
      map((result: any) => {
        return result;
      })
    )

  }

  // startInterval() {
  //   // Clear any existing subscription
  //   this.clearInterval();

  //   // Start new interval (1 minute = 60000 milliseconds)
  //   this.intervalSubscription = interval(60000).subscribe(() => {

  //   });
  // }
}
