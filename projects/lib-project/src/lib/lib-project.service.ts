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
  projectDataSubject = new BehaviorSubject<any>(null);
  currentProjectData = this.projectDataSubject.asObservable();
  projectData = {
    "tasks": [
    ],
    "certificate": {},
    "title":""
  }
  private saveProject = new BehaviorSubject<boolean>(false);
  isProjectSave = this.saveProject.asObservable();
  projectId:string|number='';

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
    this.projectDataSubject.next(this.projectData);
  }

  saveProjectFunc(newAction: boolean) {
    this.saveProject.next(newAction);
  }

  updateProjectDraft(projectId:string|number) {
    this.createOrUpdateProject(this.projectData,projectId).subscribe((res:any) => {
      console.log(res.result);
      this.setProjectData(res.result);
      this.openSnackBar()
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
            title: (this.projectData.title)? this.projectData.title: 'PROJECT_NAME'
          }
        }
      };
      this.setData(updatedData);
  }

}
