import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CardComponent, FilterComponent, HeaderComponent, PaginationComponent, SearchComponent, SideNavbarComponent, NoResultFoundComponent, DialogPopupComponent, FormService, SIDE_NAV_DATA, PROJECT_DETAILS_PAGE } from 'lib-shared-modules';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '../../services/resource-service/resource.service';
import { CommonService } from '../../services/common-service/common.service';
import { LibProjectService } from 'lib-project';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-resource-holder',
  standalone: true,
  imports: [HeaderComponent,SideNavbarComponent, CardComponent, SearchComponent, PaginationComponent, FilterComponent, MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule,TranslateModule, NoResultFoundComponent],
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
    current: { type: [] as string[] },
    status: '' as string,
    filteredLists: [] as any[],
    filterData: [] as any,
    showChangesButton: false,
    showActionButton: false,
    changeReqCount : 0
  };

  sortOptions = {
    sort_by: '',
    sort_order: ''
  };

  lists:any = [];
  noResultMessage!: string ;
  noResultFound !: string;
  pageStatus !: string;
  constructor(
    private route: ActivatedRoute, 
    private formService: FormService, 
    private resourceService: ResourceService, 
    private commonService: CommonService, 
    private libProjectService:LibProjectService, 
    private router:Router, 
    private dialog : MatDialog) {
  }

  ngOnInit() {
    this.loadSidenavData();
  }

  loadSidenavData(){
    const currentUrl = this.route.snapshot.routeConfig?.path;
    this.formService.getForm(SIDE_NAV_DATA).subscribe(form => {
      const currentData = form?.result?.data.fields.controls.find((item: any) => item.url === currentUrl);
      this.filters.filterData = currentData?.filterData || [];
      this.noResultMessage = currentData?.noResultMessage || '' ;
      this.pageStatus = currentData?.value || '';
      this.getQueryParams();
      this.noResultFound = this.noResultMessage;
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
    if(this.paginationComponent) {
      this.paginationComponent.resetToFirstPage();
    }
    this.updateQueryParams(); 
  }

  onFilterChange(event: any) {
    const filterName = event.filterName;
    if (filterName === 'type') {
      this.filters.current.type = event.values;
    } else if (filterName === 'status') {
      this.filters.status = event.values;
    } 
    this.pagination.currentPage = 0;
    if(this.paginationComponent) {
      this.paginationComponent.resetToFirstPage();
    }
    this.updateQueryParams();
  }
  
  onSortOptionsChanged(event: { sort_by: string, sort_order: string }) {
    this.sortOptions = event;
    this.pagination.currentPage = 0;
    this.paginationComponent.resetToFirstPage();
    this.updateQueryParams(); 
  }

  getList() {
    this.resourceService.getResourceList(this.pagination, this.filters, this.sortOptions, this.pageStatus).subscribe(response => {
      const result = response.result || { data: [], count: 0, changes_requested_count: 0 };
      this.lists = result.data.map(this.addActionButtons);
      this.filters.filteredLists = this.lists;
      this.pagination.totalCount = result.count;
      this.filters.showActionButton = this.lists.some((item: any) => item.status === 'DRAFT');
      if (this.lists.length === 0) {
        this.noResultMessage = this.filters.search ? "NO_RESULT_FOUND" : this.noResultFound;
      }
      this.filters.changeReqCount = result.changes_requested_count;
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
  
  handleButtonClick(event: { label: string, item: any }) {
    const { label, item } = event;
    switch (label) {
      case 'EDIT':
        this.router.navigate([PROJECT_DETAILS_PAGE], {
          queryParams: {
            projectId: item.id,
            mode: 'edit'
          }
        });
        break;
      case 'DELETE':
        this.confirmAndDeleteProject(item)
        break;
      default:
        break;
    }
  }

  deleteProject(item: any) {
    this.libProjectService.deleteProject(item.id).subscribe((response : any) => {
      this.getList(); 
    })
  }

  confirmAndDeleteProject(item: any) {
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      data : {
        header: "DELETE_RESOURCE",
        content:"CONFIRM_DELETE_MESSAGE",
        cancelButton:"CANCEL",
        exitButton:"DELETE"
      }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result.data === "CANCEL"){
          return true
        } else if(result.data === "DELETE"){
          this.deleteProject(item); 
          return true
        } else {
          return false
        }
      });
  }

}
