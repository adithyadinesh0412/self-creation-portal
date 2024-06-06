import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent, SideNavbarComponent, CardComponent, SearchComponent, PaginationComponent, FilterComponent } from '../../../../../lib-shared-modules/src/public-api';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-resource-holder',
  standalone: true,
  imports: [HeaderComponent,SideNavbarComponent, CardComponent, SearchComponent, PaginationComponent, FilterComponent, MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule,TranslateModule],
  templateUrl: './resource-holder.component.html',
  styleUrl: './resource-holder.component.scss',
})
export class ResourceHolderComponent implements OnInit{

  @ViewChild(PaginationComponent) paginationComponent!: PaginationComponent;
  backButton : boolean = true;
  subHeader : any;
  headerData : any = {};
  selctedCardItem : any;
  titleObj = {
    "title" : "Creation Portal"
  }

  pagination = {
    totalCount: 0,
    pageSize: 5,
    pageSizeOptions: [5, 10, 20, 100],
    currentPage: 0
  };
  filters = {
    search: '',
    current: {}  as { type : string},
    filteredLists: [] as any[],
    currentList: [] as any[]
  };

  public sidenavData = [
    { title: 'Project Details', action: "", icon: 'add', url: '',},
    { title: 'Browse Existing', action: "", icon: 'search', url: ''},
    { title: 'Drafts', action: "", icon: 'drafts', url: '' },
    { title: 'Submitted for Review', action: "", icon: 'send', url: ''},
    { title: 'Published', action: "", icon: 'published', url: ''},
    { title: 'Up for review', action: "", icon: 'pending', url: '' }
  ];

  resourceList = [
    { title: 'Project', image:'./../assets/images/observation.svg',
      sidenav : [
        { title: 'Project details', action: "", icon: 'add',  url: ''},
        { title: 'Tasks', action: "", icon: 'search',  url: ''},
        { title: 'Subtask and resources', action: "", icon: 'search',  url: ''},
        { title: 'Certificate', action: "", icon: 'search',  url: ''},
      ], showBackButton : true
    },
    { title: 'Observation', image:'./../assets/images/observation.svg',
      sidenav : [
        { title: 'Observation name'}
      ], showBackButton : true
    },
    { title: 'Observation with rubrics',image:'./../assets/images/observation.svg',
      sidenav : [
        { title: 'Observation name'}
      ]
    },
    { title: 'Survey', image: './../assets/images/survey.svg',
      sidenav : [
        { title: 'Survey name'}
      ]
    },
    { title: 'Program',image: './../assets/images/survey.svg',
      sidenav : [
        { title: 'Program details'},
        { title: 'Resources'},
        { title: 'Resource level targeting'}
      ]
    }
  ];

  resourceHeader = {
    "title":"Project Name",
    "buttons":[
      { title : 'Save as draft'},
      { title : 'Preview'},
      { title : 'Send for Review'}
    ]
  }

  observationwithrubricsHeader = {
    "title" : "Observation Form",
    "buttons":[
      { title : 'Pagination'},
      { title : 'Progress Status'},
      { title : 'Save as draft'},
      { title : 'Preview'},
      { title : 'Send for Review'}
    ]
  }

  lists:any = [
    {
      "id": 1,
      "title": "A Sunny Day in the mid summer during vacation of th",
      "type": "project",
      "organization": {
        "id": 24,
        "name": "Tunerlabs",
        "code": "tl"
      },
      "creator_name": "Suma",
      "status": "DRAFT",
      "actionButton": [{ action: 'EDIT', label: 'Edit', background_color: 'primary' }, { action: 'DELETE', label: 'Delete', background_color: 'warn' }]
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
      "creator_name": "Suma",
      "status": "DRAFT",
      "actionButton": [{ action: 'EDIT', label: 'Edit', background_color: 'primary' }, { action: 'DELETE', label: 'Delete', background_color: 'warn' }]
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
      "creator_name": "Suma",
      "status": "DRAFT",
      "actionButton": [{ action: 'EDIT', label: 'Edit', background_color: 'primary' }, { action: 'DELETE', label: 'Delete', background_color: 'warn' }]
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
      "creator_name": "Suma",
      "status": "DRAFT",
      "actionButton": [{ action: 'EDIT', label: 'Edit', background_color: 'primary' }, { action: 'DELETE', label: 'Delete', background_color: 'warn' }]
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
      "creator_name": "Suma",
      "status": "DRAFT",
      "actionButton": [{ action: 'EDIT', label: 'Edit', background_color: 'primary' }, { action: 'DELETE', label: 'Delete', background_color: 'warn' }]
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
      "creator_name": "Suma",
      "status": "DRAFT",
      "actionButton": [{ action: 'EDIT', label: 'Edit', background_color: 'primary' }, { action: 'DELETE', label: 'Delete', background_color: 'warn' }]
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
      "creator_name": "Suma",
      "status": "DRAFT",
      "actionButton": [{ action: 'EDIT', label: 'Edit', background_color: 'primary' }, { action: 'DELETE', label: 'Delete', background_color: 'warn' }]
    }
  ]

  filterData  = [
    {
      label:'Type',
      option: ['Project', 'Observation', 'Observation with rubrics', 'Survey', 'Programs'],
      isMultiple: true
    },
    {
      label:'Sort by',
      option: ['A to Z', 'Z to A', 'Latest first', 'Oldest first'],
      isMultiple: false
    }
  ]

  constructor() {
  }

  ngOnInit() {
    this.filters.filteredLists = this.lists;
    this.pagination.totalCount = this.lists.length;
    this.updateCurrentList();
  }
  onCardClick(cardItem: any) {
    this.sidenavData = cardItem.sidenav
    this.backButton = cardItem.showBackButton
    this.subHeader = cardItem.subHeader;

    if ((cardItem.title === 'Project') || (cardItem.title === 'Observation') || (cardItem.title === 'Survey') || (cardItem.title === 'Program')) {
      this.headerData =  this.resourceHeader;
    }
    else if (cardItem.title === 'Observation with rubrics') {
      this.headerData = this.observationwithrubricsHeader;
    }
    else {
      this.headerData = {};
    }
  }

  onButtonClick(buttonTitle: string) {
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
