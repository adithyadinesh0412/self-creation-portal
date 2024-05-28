import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent, SideNavbarComponent, CardComponent, SearchComponent, PaginationComponent, FilterComponent } from '../../../../../lib-shared-modules/src/public-api';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-resource-holder',
  standalone: true,
  imports: [HeaderComponent,SideNavbarComponent, CardComponent, SearchComponent, PaginationComponent, FilterComponent, MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule, MatCardModule],
  templateUrl: './resource-holder.component.html',
  styleUrl: './resource-holder.component.scss',
})
export class ResourceHolderComponent implements OnInit{
  backButton : boolean = true;
  subHeader : any;
  headerData : any = {};
  selctedCardItem : any;
  titleObj = {
    "title" : "Creation Portal"
  }
  totalCount = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20, 100];
  currentPage = 0;
  currentSearch = '';
  filteredLists: any[] = [];
  currentFilters: any = {};
  searchControl = new FormControl();
  currentList: any[] = [];
  setPaginatorToFirstpage: boolean = false;

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

  filterData  = [
    {
      label:'Type',
      option: ['Project', 'Observation', 'Observation with rubrics', 'Survey', 'Programs']
    },
    {
      label:'Sort by',
      option: ['A to Z', 'Z to A', 'Latest first', 'Oldest first']
    }
  ]

  constructor() {
  }

  ngOnInit() {
    this.filteredLists = this.lists;
    this.totalCount = this.lists.length;
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
    this.pageSize = event.pageSize;
    this.currentPage = event.page - 1; 
    this.updateCurrentList();
  }

  receiveSearchResults(event: string) {
    this.currentSearch = event.trim().toLowerCase();
    this.currentPage = 0;
    this.setPaginatorToFirstpage = true
    this.applyFiltersAndSearch();
  }

  onFilterChange(event: any) {
    this.currentFilters.type = event;
    this.currentPage = 0;
    this.setPaginatorToFirstpage = true
    this.applyFiltersAndSearch();
  }

  applyFiltersAndSearch() {
    let filteredLists = this.lists;
    if (this.currentFilters.type) {
      filteredLists = filteredLists.filter((item: any) => item.type.toLowerCase() === this.currentFilters.type.toLowerCase());
    }

    if (this.currentSearch) {
      filteredLists = filteredLists.filter((item: any) => item.title.toLowerCase().includes(this.currentSearch));
    }

    this.filteredLists = filteredLists;
    this.totalCount = filteredLists.length;
    this.updateCurrentList();
  }

  updateCurrentList() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.currentList = this.filteredLists.slice(start, end);
  }

}
