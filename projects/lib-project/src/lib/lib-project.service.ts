import { Injectable } from '@angular/core';
import { HttpProviderService } from 'lib-shared-modules';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from './dock/configs/config.service';


@Injectable({
  providedIn: 'root'
})
export class LibProjectService {
  private dataSubject = new BehaviorSubject<any>(null);
  currentData = this.dataSubject.asObservable();

  constructor(private httpService:HttpProviderService, private Configuration:ConfigService) {
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  createOrUpdateProject(projectData?:any) {
    const config = {
      url: this.Configuration.urlConFig.PROJECT_URLS.CREATE_OR_UPDATE_PROJECT,
      payload: projectData ? projectData : ''
    };
    return this.httpService.post(config.url, config.payload);
  }

}
