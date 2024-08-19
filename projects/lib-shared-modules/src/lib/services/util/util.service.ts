import { Injectable } from '@angular/core';
import { ConfigService } from '../../configs/config.service';
import { HttpProviderService } from '../http-provider.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor( private Configuration:ConfigService,private httpService:HttpProviderService) { }

  approveResource(data:any){
    const config = {
      url : `${this.Configuration.urlConFig.RESOURCE_URLS.APPROVE_PROJECT}/${data.id}`,
      payload:{

        "comment": {
          "comment": "Check spelling",
          "context": "page",
          "page": "draft"
          }}
    };
    return this.httpService.post(config.url, config.payload)
  }

  updateReview(data:any){
    const config = {
      url : `${this.Configuration.urlConFig.RESOURCE_URLS.UPDATE_REVIEW}/${data.id}`,
      payload: data.payload ? data.payload : {}
    }
    return this.httpService.post(config.url, config.payload)
  }

  startOrResumeReview(id:any){
    const config = {
      url : `${this.Configuration.urlConFig.RESOURCE_URLS.START_REVIEW}/${id}`,
      payload:{}
    }
    return this.httpService.post(config.url, config.payload)
  }

  rejectOrReportedReview(data:any){
    const config = {
      url : `${this.Configuration.urlConFig.RESOURCE_URLS.REJECT_OR_REPORTED}/${data.id}`,
      payload:{}
    }
    return this.httpService.post(config.url, config.payload)
  }

  updateComment(resourceId:string|number,payload:any,commentId:string|number = ''){
    const config = {
      url : `${this.Configuration.urlConFig.RESOURCE_URLS.UPDATE_COMMENT+commentId+"?resource_id="+resourceId}`,
      payload:payload
    };
    return this.httpService.post(config.url, config.payload)
  }

  getCommentList(){
    const config = {
      url : `${this.Configuration.urlConFig.RESOURCE_URLS.COMMENT_LIST}`,
    };
    return this.httpService.get(config.url)
  }


}
