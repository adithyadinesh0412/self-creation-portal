import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CardComponent, FilterComponent, HeaderComponent, PaginationComponent, SearchComponent, SideNavbarComponent } from 'lib-shared-modules';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../../../../lib-shared-modules/src/lib/services/form/form.service';
import { ResourceService } from '../../services/resource-service/resource.service';
import { SIDE_NAV_DATA } from '../../../../../lib-shared-modules/src/lib/constants/formConstant';
import { CommonService } from '../../services/common-service/common.service';


@Component({
  selector: 'app-resource-holder',
  standalone: true,
  imports: [HeaderComponent,SideNavbarComponent, CardComponent, SearchComponent, PaginationComponent, FilterComponent, MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule,TranslateModule],
  templateUrl: './resource-holder.component.html',
  styleUrl: './resource-holder.component.scss',
})
export class ResourceHolderComponent implements OnInit{

  @ViewChild(PaginationComponent) paginationComponent!: PaginationComponent;

  pagination = {
    totalCount: 0,
    pageSize: 5,
    pageSizeOptions: [5, 10, 20, 100],
    currentPage: 0
  };

  filters = {
    search: '',
    current: {}  as { type: string},
    filteredLists: [] as any[],
    filterData: [] as any,
    showChangesButton: false,
    showActionButton: false
  };

  sortOptions = {
    sort_by: '',
    sort_order: ''
  };

  lists:any = [];
  constructor(private route: ActivatedRoute, private formService: FormService, private resourceService: ResourceService, private commonService: CommonService) {
  }

  ngOnInit() {
    this.loadSidenavData();
    this.getQueryParams();
  }

  loadSidenavData(){
    const currentUrl = this.route.snapshot.routeConfig?.path;
    this.formService.getForm(SIDE_NAV_DATA).subscribe(form => {
      const currentData = form?.result?.data.fields.controls.find((item: any) => item.url === currentUrl)?.filterData;
      this.filters.filterData = currentData || [];
      this.filters.showChangesButton = this.filters.filterData.some((filter: any) => filter.label === 'STATUS');
    });
  }

  onPageChange(event: any) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.currentPage = event.page - 1;
    this.getList();
    this.updateQueryParams(); 
  }

  receiveSearchResults(event: string) {
    this.filters.search = event.trim().toLowerCase();
    this.pagination.currentPage = 0;
    this.paginationComponent.resetToFirstPage();
    this.updateQueryParams(); 
  }

  onFilterChange(event: any) {
    this.filters.current.type = event;
    this.pagination.currentPage = 0;
    this.paginationComponent.resetToFirstPage();
    this.updateQueryParams(); 
  }

  onSortOptionsChanged(event: { sort_by: string, sort_order: string }) {
    this.sortOptions = event;
    this.pagination.currentPage = 0;
    this.paginationComponent.resetToFirstPage();
    this.updateQueryParams(); 
  }

  getList() {
    this.resourceService.getResourceList(this.pagination, this.filters, this.sortOptions).subscribe(response => {
      const result = response.result || { data: [], count: 0 };
      this.lists = result.data.map(this.addActionButtons);
      this.filters.filteredLists = this.lists;
      this.pagination.totalCount = result.count;
      this.filters.showActionButton = this.lists.some((item: any) => item.status === 'DRAFT');
    });
  }

  addActionButtons(item: any): any {
    item.actionButton = item.actionButton || [
      { action: 'EDIT', label: 'EDIT', background_color: '#0a4f9d'  },
      { action: 'DELETE', label: 'DELETE', background_color:'#EC555D' }
    ];
    return item;
  }

  //updateQueryParams to router
  updateQueryParams() {
    const queryParams = this.commonService.generateParams(this.pagination, this.filters, this.sortOptions);
    this.commonService.updateQueryParams(queryParams);
  }

  getQueryParams() {
    this.route.queryParams.subscribe(params => {
      this.commonService.applyQueryParams(params, this.pagination, this.filters, this.sortOptions);
      this.getList();
    });
  }
  
}
