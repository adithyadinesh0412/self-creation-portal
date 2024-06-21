import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private router:Router, private route: ActivatedRoute) { }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  createUrlWithParams(baseUrl: string, params: { [key: string]: any }): string {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return `${baseUrl}?${httpParams.toString()}`;
  }

  updateQueryParams(params: { [key: string]: any }) {
    console.log("calling service")
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: '' 
    });
  }
  
  generateParams(pagination: any, filters: any, sortOptions: any): { [key: string]: any } {
    return {
      page: pagination.currentPage + 1,
      limit: pagination.pageSize,
      type: filters.current.type || "",
      status: 'draft',
      sort_by:  sortOptions.sort_by || '',
      sort_order: sortOptions.sort_order || '',
      filter: '',
      search: btoa(filters.search) || '',
      page_status: 'drafts'
    };
  }

  applyQueryParams(params: any, pagination: any, filters: any, sortOptions: any) {
    pagination.currentPage = +params['page'] - 1 || 0;
    pagination.pageSize = +params['limit'] || pagination.pageSize;
    filters.current.type = params['type'] || '';
    filters.search = params['search'] ? atob(params['search']) : '';
    sortOptions.sort_by = params['sort_by'] || '';
    sortOptions.sort_order = params['sort_order'] || '';
  }

}
