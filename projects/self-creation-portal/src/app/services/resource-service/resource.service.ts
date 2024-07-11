import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from "../common-service/common.service";
import { RESOURCE_URLS } from '../configs/url.config.json';
import { HttpProviderService } from 'lib-shared-modules';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private httpService: HttpProviderService, private commonService: CommonService) { }

  getResourceList(pagination: any, filters: any, sortOptions: any, pageStatus: string = ''): Observable<any> {
    const endpoint = RESOURCE_URLS.RESOURCE_LIST;
    const params = this.commonService.generateParams(pagination, filters, sortOptions, pageStatus);
    const url = this.commonService.createUrlWithParams(endpoint, params);
    return this.httpService.get(url);
  }
}
