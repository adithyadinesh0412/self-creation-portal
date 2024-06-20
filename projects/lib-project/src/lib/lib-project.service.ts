import { Injectable } from '@angular/core';
import { HttpProviderService } from 'lib-shared-modules';
import { BehaviorSubject, map } from 'rxjs';
import { ConfigService } from 'lib-shared-modules'
import { ActivatedRoute, Router } from '@angular/router';


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
    "tasks": [
      {}
    ],
    "certificate": {}
  }
  private saveProject = new BehaviorSubject<boolean>(false);
  isProjectSave = this.saveProject.asObservable();
  projectId:string|number='';

  constructor(private httpService:HttpProviderService, private Configuration:ConfigService, private route:ActivatedRoute,private router:Router) {
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  saveProjectFunc(newAction: boolean) {
    this.saveProject.next(newAction);
  }

  createOrUpdateProject(projectData?:any,projectId?:string|number) {
    // projectData = {...this.projectData,...projectData}
    projectData = {
      "title": "Backend project",
      "categories": [
        "communication"
      ],
      "recommented_duration": {
        "type": "week",
        "number": 5
      },
      "keywords": "test",
      "recommeneded_for": [
        "HM"
      ],
      "languages": [
        "en"
      ],
      "learning_resources": [
        {
          "name": "sample doc",
          "url": "http://test.com"
        }
      ],
      "licence": "CC BY 4.0",
      "tasks": [
        {
          "id": "7a8b13fb-c9e1-4296-8abd-8b64b357a128",
          "name": "task without children",
          "type": "content",
          "is_mandatory": true,
          "allow_evidences": true,
          "evidence_details": {
            "file_types": [
              "mp4"
            ],
            "min_no_of_evidences": 5
          },
          "learning_resources": [
            {
              "name": "sample doc",
              "url": "http://test.com"
            }
          ],
          "sequence_no": 1
        }
      ],
      "certificate": {}
    }
    const config = {
      url: projectId ? this.Configuration.urlConFig.PROJECT_URLS.CREATE_OR_UPDATE_PROJECT+'/'+projectId : this.Configuration.urlConFig.PROJECT_URLS.CREATE_OR_UPDATE_PROJECT,
      payload: projectId ? projectData : ''
    };
    return this.httpService.post(config.url, config.payload);
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

}
