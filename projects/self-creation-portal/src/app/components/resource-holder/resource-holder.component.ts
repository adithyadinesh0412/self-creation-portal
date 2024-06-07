import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent, SideNavbarComponent, CardComponent, SearchComponent, PaginationComponent, FilterComponent } from '../../../../../lib-shared-modules/src/public-api';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../services/form/form.service';
import { SIDE_NAV_DATA } from '../../constants/formConstant';


@Component({
  selector: 'app-resource-holder',
  standalone: true,
  imports: [HeaderComponent,SideNavbarComponent, CardComponent, SearchComponent, PaginationComponent, FilterComponent, MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule],
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
    currentList: [] as any[],
    filterData: [] as any,
    showChangesButton: false
  };

  lists:any = [
    {
      "id": 1,
      "title": "sample project",
      "type": "project",
      "organization": {
          "id": 24,
          "name": "Tunerlabs",
          "code": "tl"
      },
      "status": "DRAFT",
      "actionButton":[{action:'VIEW',"label":'View'},{ action:'EDIT',label:'Edit'}]
    },
    {
      "id": 2,
      "title": "sample project",
      "type": "project",
      "organization": {
          "id": 24,
          "name": "Tunerlabs",
          "code": "tl"
      },
      "status": "DRAFT",
      "actionButton":[{action:'VIEW',label:'View'},{ action:'EDIT',label:'Edit'}]
    },
    {
      "id": 3,
      "title": "sample survey",
      "type": "survey",
      "organization": {
          "id": 24,
          "name": "Tunerlabs",
          "code": "tl"
      },
      "status": "DRAFT",
      "actionButton":[{action:'VIEW',label:'View'},{ action:'EDIT',label:'Edit'}]
    },
    {
      "id": 4,
      "title": "sample project",
      "type": "project",
      "organization": {
          "id": 24,
          "name": "Tunerlabs",
          "code": "tl"
      },
      "status": "DRAFT",
      "actionButton":[{action:'VIEW',label:'View'},{ action:'EDIT',label:'Edit'}]
    },
    {
      "id": 5,
      "title": "sample project",
      "type": "project",
      "organization": {
          "id": 24,
          "name": "Tunerlabs",
          "code": "tl"
      },
      "status": "DRAFT",
      "actionButton":[{action:'VIEW',label:'View'},{ action:'EDIT',label:'Edit'}]
    },
    {
    "id": 6,
    "title": "sample project",
    "type": "observation with rubrics",
    "organization": {
        "id": 24,
        "name": "Tunerlabs",
        "code": "tl"
    },
    "status": "DRAFT",
    "actionButton":[{action:'VIEW',label:'View'},{ action:'EDIT',label:'Edit'}]
    },
    {
    "id": 7,
    "title": "sample project",
    "type": "observation",
    "organization": {
        "id": 24,
        "name": "Tunerlabs",
        "code": "tl"
    },
    "status": "DRAFT",
    "actionButton":[{action:'VIEW',label:'View'},{ action:'EDIT',label:'Edit'}]
    }
  ]

  constructor(private route: ActivatedRoute, private formService: FormService) {
  }

  ngOnInit() {
    this.loadSidenavData();
    this.filters.filteredLists = this.lists;
    this.pagination.totalCount = this.lists.length;
    this.updateCurrentList();
  }

  loadSidenavData(){
    const currentUrl = this.route.snapshot.routeConfig?.path;
    this.formService.getForm(SIDE_NAV_DATA).subscribe(form => {
      const currentData = form.find((item: any) => item.url === currentUrl)?.filterData;
      this.filters.filterData = currentData || [];
      this.filters.showChangesButton = this.filters.filterData.some((filter: any) => filter.label === 'Status');
    });
  }

  onPageChange(event: any) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.currentPage = event.page - 1; 
    this.updateCurrentList();
  }

  receiveSearchResults(event: string) {
    this.filters.search = event.trim().toLowerCase();
    this.pagination.currentPage = 0;
    this.applyFiltersAndSearch();
    this.paginationComponent.resetToFirstPage();
  }

  onFilterChange(event: any) {
    this.filters.current.type = event;
    this.pagination.currentPage = 0;
    this.applyFiltersAndSearch();
    this.paginationComponent.resetToFirstPage();
  }

  applyFiltersAndSearch() {
    let filteredLists = this.lists;
    if (this.filters.current.type) {
      filteredLists = filteredLists.filter((item: any) => item.type.toLowerCase() === this.filters.current.type.toLowerCase());
    }

    if (this.filters.search) {
      filteredLists = filteredLists.filter((item: any) => item.title.toLowerCase().includes(this.filters.search));
    }
    
    this.filters.filteredLists = filteredLists;
    this.pagination.totalCount = filteredLists.length;
    this.updateCurrentList();
  }

  updateCurrentList() {
    const start = this.pagination.currentPage * this.pagination.pageSize;
    const end = start + this.pagination.pageSize;
    this.filters.currentList = this.filters.filteredLists.slice(start, end);
  }

}
