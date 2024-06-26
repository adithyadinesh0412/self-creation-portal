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
  currentData = this.dataSubject.asObservable();
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
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  saveProjectFunc(newAction: boolean) {
    this.saveProject.next(newAction);
  }

  updateProjectData(projectData:any) {
    this.projectData = {...this.projectData,...projectData}
    console.log(this.projectData);
  }

  updateProjectDraft(projectId:string|number) {
    return this.createOrUpdateProject(this.projectData,projectId)
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
      const currentData = this.dataSubject.getValue();
      const updatedData = {
        ...currentData,
        sidenavData: {
          ...currentData.sidenavData,
          headerData: {
            ...currentData.sidenavData.headerData,
            title: (this.projectData.title)? this.projectData.title: 'PROJECT_NAME'
          }
        }
      };
      this.setData(updatedData);
  }

}
