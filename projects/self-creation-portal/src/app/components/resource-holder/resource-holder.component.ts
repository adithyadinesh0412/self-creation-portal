import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CardComponent, FilterComponent, HeaderComponent, PaginationComponent, SearchComponent, SideNavbarComponent, NoResultFoundComponent, DialogPopupComponent, FormService, SIDE_NAV_DATA, PROJECT_DETAILS_PAGE, ToastService } from 'lib-shared-modules';
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
export class ResourceHolderComponent implements OnInit, OnDestroy{

  @ViewChild(PaginationComponent) paginationComponent!: PaginationComponent;

  pagination = {
    totalCount: 0,
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 100],
    currentPage: 0
  };

  filters = {
    search: '',
    current: { type: [] as string[] },
    status: '' as string,
    filteredLists: [] as any[],
    filterData: [] as any,
    showActionButton: false,
    changeReqCount : 0,
    inprogressCount  : 0,
    activeFilterButton: '' as string
  };

  sortOptions = {
    sort_by: '',
    sort_order: ''
  };

  lists:any = [];
  isDataLoaded : boolean = false;
  noResultMessage!: string ;
  noResultFound !: string;
  pageStatus !: string;
  buttonsData: any = {};
  buttonsCSS : any;

  reviewList : any = [
    {
      "id": 3,
      "title": "review",
      "type": "projects",
      "status": "SUBMITTED",
      "submitted_on": null,
      "last_reviewed_on": null,
      "notes": "hey hello",
      "review_status": null,
      "creator": "yodi test",
      "organization": {
        "id": 24,
        "name": "Shikshalokam",
        "code": "sl"
      }
    },
      {
            "id": 4,
            "title": "sample project",
            "type": "projects",
            "status": "SUBMITTED",
            "submitted_on": null,
            "last_reviewed_on": null,
            "notes": "hey hello",
            "review_status": null,
            "creator": "yodi test",
            "organization": {
              "id": 24,
              "name": "Shikshalokam",
              "code": "sl"
            }
      },
      {
        "id": 5,
        "title": "upforreview",
        "type": "projects",
        "status": "SUBMITTED",
        "submitted_on": null,
        "last_reviewed_on": null,
        "notes": "hey hello",
        "review_status": null,
        "creator": "yodi test",
        "organization": {
          "id": 24,
          "name": "Shikshalokam",
          "code": "sl"
        },
      },
      {
            "id": 158,
            "title": "Untitled project",
            "type": "projects",
            "status": "IN_REVIEW",
            "submitted_on": null,
            "last_reviewed_on": null,
            "created_at": "2024-07-11T10:44:09.000Z",
            "notes": "hey hello",
            "review_status": "INPROGRESS",
            "creator": "yodi test",
            "organization": {
              "id": 24,
              "name": "Tunerlabs",
              "code": "tl",
              "description": "Tunerlabs"
            }
      }
  ]
     
  constructor(
    private route: ActivatedRoute, 
    private formService: FormService, 
    private resourceService: ResourceService, 
    private commonService: CommonService, 
    private libProjectService:LibProjectService, 
    private router:Router, 
    private dialog : MatDialog,
    private toastService:ToastService) {
  }

  ngOnInit() {
    this.loadSidenavData();
  }

  ngOnDestroy() {
    this.commonService.clearQueryParams();
  }

  loadSidenavData(){
    const currentUrl = this.route.snapshot.routeConfig?.path;
    this.formService.getForm(SIDE_NAV_DATA).subscribe(form => {
      const currentData = form?.result?.data.fields.controls.find((item: any) => item.url === currentUrl);
      this.buttonsCSS = form?.result?.data.fields.buttons;
      this.filters.filterData = currentData?.filterData || [];
      this.noResultMessage = currentData?.noResultMessage || '' ;
      this.pageStatus = currentData?.value || '';
      this.buttonsData = [
        ...(currentData.buttonsData ? currentData.buttonsData[0].buttons : []),
        ...(currentData.statusButtons || [])
      ];
      this.getQueryParams();
      this.noResultFound = this.noResultMessage;
      this.filters.showActionButton = this.buttonsData;
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
    this.isDataLoaded = false;
    if((this.pageStatus === 'drafts' ) || (this.pageStatus === 'submitted_for_review')) {
      this.resourceService.getResourceList(this.pagination, this.filters, this.sortOptions, this.pageStatus).subscribe(response => {
        const result = response.result || { data: [], count: 0, changes_requested_count: 0 };
        this.lists = this.addActionButtons(result.data)
        this.filters.filteredLists = this.lists;
        this.pagination.totalCount = result.count;
        if (this.lists.length === 0) {
          this.noResultMessage = this.filters.search ? "NO_RESULT_FOUND" : this.noResultFound;
          if (this.pagination.currentPage > 0) {
            this.pagination.currentPage -= 1;
          }
        }
        this.filters.changeReqCount = result.changes_requested_count;
        this.isDataLoaded = true;
      });
    }
    else if(this.pageStatus === 'up_for_review') {
      const result = this.reviewList;
      this.lists = this.addActionButtons(result)
      this.filters.filteredLists = this.lists;
      this.filters.inprogressCount = this.reviewList.filter((item : any) => item.review_status === 'INPROGRESS').length;
      this.pagination.totalCount = result.length;  
      this.isDataLoaded = true;
    }
  }

  addActionButtons(cardItems: any): any {
    if (!this.buttonsData) {
      return cardItems;
    }
    cardItems.forEach((cardItem : any) => {
      cardItem.actionButton = [];
      if (this.buttonsData) {
        this.buttonsData.forEach((button: any) => {
          if (this.buttonsCSS[button]) {
            cardItem.actionButton.push(this.buttonsCSS[button]);
          }
          if(button.buttons){
            if(!cardItem.review_status) {
              if (button.status === 'NOT_STARTED' && ((cardItem.status === 'SUBMITTED') || (cardItem.status === 'IN_REVIEW'))) {
                button.buttons.forEach((btn: string) => {
                if (btn) {
                  cardItem.actionButton.push(this.buttonsCSS[btn]);
                }
              });
              }
            }
            
            if(button.status === cardItem.review_status){
              button.buttons.forEach((button : any) => {
                cardItem.actionButton.push(this.buttonsCSS[button]);
              })
            }
          }
        });
      }
    });
    return cardItems
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
  
  statusButtonClick(event: { label: string, item: any }) {
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
      case 'VIEW':
        this.router.navigate([PROJECT_DETAILS_PAGE], {
          queryParams: {
            projectId: item.id,
            mode: 'viewOnly'
          }
        });
        break;
      case 'START_REVIEW':
        this.router.navigate([PROJECT_DETAILS_PAGE], {
          queryParams: {
            projectId: item.id,
            mode: 'review'
          }
        });
        break;
      case 'RESUME_REVIEW':
        this.router.navigate([PROJECT_DETAILS_PAGE], {
          queryParams: {
            projectId: item.id,
            mode: 'review'
          }
        })
        break;
      default:
        break;
    }
  }

  filterButtonClickEvent(event : { label: string }) {
    this.filters.activeFilterButton = event.label;
    switch(event.label) {
      case 'CHANGES_REQUIRED':
        this.filters.filteredLists = this.lists.filter((item : any) => item.review_status === 'COMMENTS');
        if(this.filters.filteredLists.length === 0) {
          this.noResultMessage = "NO_CHANGE_REQUIRED"
        }
        break;
      case 'INPROGRESS':
        this.filters.filteredLists = this.reviewList.filter((item: any) => item.review_status === 'INPROGRESS');
        if(this.filters.filteredLists.length === 0) {
          this.noResultMessage = "NO_INPROGRESS_REVIEW"
        }
        break;
    }
  }

  deleteProject(item: any) {
    this.libProjectService.deleteProject(item.id).subscribe((response : any) => {
      if (this.lists.length === 1 && this.pagination.currentPage > 0) {
        this.pagination.currentPage -= 1;
      }
      this.toastService.openSnackBar({
        "message": 'RESOURCE_DELETED_SUCCESSFULLY',
        "class": "success"
      })
      this.getList();
    })
  }

  confirmAndDeleteProject(item: any) {
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      disableClose: true,
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
