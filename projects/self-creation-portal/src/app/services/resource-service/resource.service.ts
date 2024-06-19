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

  private generateParams(pagination: any, filters: any, sortOptions: any): { [key: string]: any } {
    return {
      page: pagination.currentPage + 1,
      limit: pagination.pageSize,
      type: filters.current.type || "",
      status: 'draft',
      sort_by:  sortOptions.sort_by || '',
      sort_order: sortOptions.sort_order || '',
      filter: '',
      search: btoa(filters.search) || ''
    };
  }

  getResourceList(pagination: any, filters: any, sortOptions: any): Observable<any> {
    const endpoint = RESOURCE_URLS.RESOURCE_LIST;
    const params = this.generateParams(pagination, filters, sortOptions);
    const url = this.commonService.createUrlWithParams(endpoint, params);
    return this.httpService.get(url);
  }
}
