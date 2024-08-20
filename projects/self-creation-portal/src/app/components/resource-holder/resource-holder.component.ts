import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CardComponent, FilterComponent, HeaderComponent, PaginationComponent, SearchComponent, SideNavbarComponent, NoResultFoundComponent, DialogPopupComponent, FormService, SIDE_NAV_DATA, PROJECT_DETAILS_PAGE, ToastService, UtilService } from 'lib-shared-modules';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '../../services/resource-service/resource.service';
import { CommonService } from '../../services/common-service/common.service';
import { LibProjectService } from 'lib-project';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-resource-holder',
  standalone: true,
  imports: [HeaderComponent,SideNavbarComponent, CardComponent, SearchComponent, PaginationComponent, FilterComponent, MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule,TranslateModule, NoResultFoundComponent],
  templateUrl: './resource-holder.component.html',
  styleUrl: './resource-holder.component.scss',
  providers: [DatePipe]
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
    activeFilterButton: '' as string,
    showInfoIcon: false
  };

  sortOptions = {
    sort_by: '',
    sort_order: ''
  };

  lists:any = [];
  noResultMessage!: string ;
  noResultFound !: string;
  pageStatus !: string;
  buttonsData: any = {};
  infoFieldsData: any = {};
  buttonsCSS : any;
  activeRole:any;

  constructor(
    private route: ActivatedRoute, 
    private formService: FormService, 
    private resourceService: ResourceService, 
    private commonService: CommonService, 
    private libProjectService:LibProjectService, 
    private router:Router, 
    private dialog : MatDialog,
    private toastService:ToastService,
    private datePipe: DatePipe,
    private utilService:UtilService) {
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
      const selectedSideNavData = form?.result?.data.fields.controls.find((item: any) => item.url === currentUrl);
      this.activeRole = selectedSideNavData.activeRole;
      this.buttonsCSS = form?.result?.data.fields.buttons;
      this.filters.filterData = selectedSideNavData?.filterData || [];
      this.noResultMessage = selectedSideNavData?.noResultMessage || '' ;
      this.pageStatus = selectedSideNavData?.value || '';
      this.buttonsData = [
        ...(selectedSideNavData.buttonsData ? [].concat(...selectedSideNavData.buttonsData.map((item: any) => item.buttons || [])) : []),
        ...(selectedSideNavData.statusButtons || [])
      ];
      this.infoFieldsData = [
        ...(selectedSideNavData.buttonsData ? [].concat(...selectedSideNavData.buttonsData.map((item: any) => item.infoFields || [])) : []),
        ...(selectedSideNavData.statusButtons ? [].concat(...selectedSideNavData.statusButtons.map((statusButton: any) =>
          (statusButton.infoFields || []).map((infoField: any) => ({ ...infoField, status: statusButton.status }))
        )) : [])
      ];
      this.getQueryParams();
      this.noResultFound = this.noResultMessage;
      this.filters.showActionButton = this.buttonsData;
      this.filters.showInfoIcon = true;
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
    if (this.pageStatus === 'drafts' || this.pageStatus === 'submitted_for_review') {
      this.resourceService.getResourceList(this.pagination, this.filters, this.sortOptions, this.pageStatus).subscribe(response => {
        this.handleResponse(response);
      });
    } else if (this.pageStatus === 'up_for_review') {
      this.resourceService.getUpForReviewList(this.pagination, this.filters, this.sortOptions).subscribe(response => {
        this.handleResponse(response);
      });
    }
  }
  
  handleResponse(response: any) {
    const result = response.result || { data: [], count: 0, changes_requested_count: 0 };
    this.lists = this.addActionButtons(result.data);
    this.filters.filteredLists = this.lists;
    this.pagination.totalCount = result.count;
    if (this.lists.length === 0) {
      this.noResultMessage = this.filters.search ? "NO_RESULT_FOUND" : this.noResultFound;
      if (this.pagination.currentPage > 0) {
        this.pagination.currentPage -= 1;
      }
    }
    this.filters.changeReqCount = result.changes_requested_count;
    this.filters.inprogressCount = result.in_progress_count;
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
            if (button.status === 'NOT_STARTED' && ((cardItem.status === 'SUBMITTED'))) {
              button.buttons.forEach((btn: string) => {
              if (btn) {
                cardItem.actionButton.push(this.buttonsCSS[btn]);
              }
            });
            }

          if((button.status === cardItem.status)){
            button.buttons.forEach((button : any) => {
              cardItem.actionButton.push(this.buttonsCSS[button]);
            })
          }
          if(((button.status === cardItem.review_status) && this.activeRole == "reviewer")){
            button.buttons.forEach((button : any) => {
              cardItem.actionButton.push(this.buttonsCSS[button])
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
         if(item.status == "SUBMITTED" && this.activeRole == "creator"){
           this.router.navigate([PROJECT_DETAILS_PAGE], {
             queryParams: {
               projectId: item.id,
               mode: 'viewOnly'
             }
           });
           break;
         }else if(item.status == "SUBMITTED" && this.activeRole == "reviewer"){
           this.router.navigate([PROJECT_DETAILS_PAGE], {
             queryParams: {
               projectId: item.id,
               mode: 'reviewerView'
             }
           });
           break;
         }else{
           this.router.navigate([PROJECT_DETAILS_PAGE], {
             queryParams: {
               projectId: item.id,
               mode: 'viewOnly'
             }
           });
           break;
         }
         
       case 'START_REVIEW':
        this.utilService.startOrResumeReview(item.id).subscribe((data)=>{})
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
    if(this.filters.activeFilterButton === event.label) {
      this.filters.activeFilterButton = '';
      this.filters.status = '';
    } else {
      this.filters.activeFilterButton = event.label;
      this.filters.status = event.label;
    }
    this.pagination.currentPage = 0;
    if(this.paginationComponent) {
    this.paginationComponent.resetToFirstPage();
     }
    this.updateQueryParams();
  }

  infoIconClickEvent(event: any) {
    const cardItem = event.item;
  
    //to get field data from listapi to map in json
    const getFieldData = (field: any) => {
      let value = cardItem[field.name] || '';
      if (field.name.includes('organization')) {
        value = cardItem.organization ? cardItem.organization.name : '';
      } else if (this.commonService.isISODate(value)) { 
        value = this.datePipe.transform(value, 'dd/MM/yyyy'); 
      }
      return {
        label: field.label,
        value: value
      };
    };
  
    // Function to filter and map fields based on conditions
    const filterAndMapFields = (status: string | null) => {
      return this.infoFieldsData
        .filter((field: any) => field.status === status || !field.status)
        .map(getFieldData);
    };
  
    //info fields to display as per the review_status
    let infoFields = [];
    if (!cardItem.review_status && (cardItem.status === 'SUBMITTED' || cardItem.status === 'IN_REVIEW')) {
      infoFields = filterAndMapFields('NOT_STARTED');
    } else {
      infoFields = filterAndMapFields(cardItem.review_status);
    }
  
    // If no fields match the conditions, default to 'NOT_STARTED' fields
    if (infoFields.length === 0) {
      infoFields = filterAndMapFields('NOT_STARTED');
    }
  
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      data: {
        header: "DETAILS",
        fields: infoFields
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      return result ? true : false;
    });
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
