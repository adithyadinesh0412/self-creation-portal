import { Injectable } from '@angular/core';
import { HttpProviderService } from 'lib-shared-modules';
import { BehaviorSubject, map } from 'rxjs';
import { ConfigService } from './dock/configs/config.service';
import { PROJECT_URLS,FORM_URLS } from './dock/configs/url.config.json';


@Injectable({
  providedIn: 'root'
})
export class LibProjectService {
  dataSubject = new BehaviorSubject<any>(null);
  currentData = this.dataSubject.asObservable();
  projectData = {
    "title": '',
    "categories": [],
    "recommented_duration": {
      "type": "",
      "number": 0
    },
    "keywords": "",
    "recommeneded_for": [],
    "languages": [],
    "learning_resources": [],
    "licence": "",
    "tasks": [],
    "certificate": {}
  }
  private saveProject = new BehaviorSubject<boolean>(false);
  isProjectSave = this.saveProject.asObservable();

  constructor(private httpService:HttpProviderService, private Configuration:ConfigService) {
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  saveProjectFunc(newAction: boolean) {
    this.saveProject.next(newAction);
  }

  createOrUpdateProject(projectData?:any) {
    projectData = {...this.projectData,...projectData}
    const config = {
      url: projectData ? PROJECT_URLS.CREATE_OR_UPDATE_PROJECT+'/'+projectData.projectID : PROJECT_URLS.CREATE_OR_UPDATE_PROJECT,
      payload: projectData ? projectData : ''
    };
    return this.httpService.post(config.url, config.payload);
  }

  // Getting form from api
  getForm(formBody: any) {
    const config = {
      url: FORM_URLS.READ_FORM,
      payload: formBody,
    };
    return this.httpService.post(config.url, config.payload).pipe(
      map((result: any) => {
        return result;
      })
    )
  }

}
