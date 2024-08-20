import { Injectable } from '@angular/core';
import { ConfigService } from '../../configs/config.service';
import { HttpProviderService } from '../http-provider.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor( private Configuration:ConfigService,private httpService:HttpProviderService) { }

  approveResource(resourceId:string|number,payload:any){
    const config = {
      url : `${this.Configuration.urlConFig.RESOURCE_URLS.APPROVE_PROJECT}/${resourceId}`,
      payload:payload
    }
    return this.httpService.post(config.url, config.payload)
  }

  updateReview(resourceId:string|number,payload:any){
    const config = {
      url : `${this.Configuration.urlConFig.RESOURCE_URLS.UPDATE_REVIEW}/${resourceId}`,
      payload: payload
    }
    return this.httpService.post(config.url, config.payload)
  }

  startOrResumeReview(resourceId:string|number){
    const config = {
      url : `${this.Configuration.urlConFig.RESOURCE_URLS.START_REVIEW}/${resourceId}`,
      payload:{}
    }
    return this.httpService.post(config.url, config.payload)
  }

  rejectOrReportedReview(resourceId:string|number,payload:any,isReported:boolean=false){
    const config = {
      url : `${this.Configuration.urlConFig.RESOURCE_URLS.REJECT_OR_REPORTED}/${resourceId}${isReported === true ? `?isReported=${isReported}` : ''}`,
      payload:payload
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

  getCommentList(resourceId:string|number){
    const config = {
      url : `${this.Configuration.urlConFig.RESOURCE_URLS.COMMENT_LIST+"?resource_id="+resourceId}`,
    };
    return this.httpService.get(config.url)
  }

}
