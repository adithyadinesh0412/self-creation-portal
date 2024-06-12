import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent, SideNavbarComponent, CardComponent, SearchComponent, PaginationComponent, FilterComponent } from '../../../../../lib-shared-modules/src/public-api';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../services/form/form.service';
import { SIDE_NAV_DATA } from '../../constants/formConstant';


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

  lists:any = []
  constructor(private route: ActivatedRoute, private formService: FormService) {
  }

  ngOnInit() {
    this.loadSidenavData();
    this.getList();
  }

  loadSidenavData(){
    const currentUrl = this.route.snapshot.routeConfig?.path;
    const isDraftsUrl = !!currentUrl && currentUrl.includes('drafts');
    this.formService.getForm(SIDE_NAV_DATA).subscribe(form => {
      const currentData = form?.result?.data.fields.controls.find((item: any) => item.url === currentUrl)?.filterData;
      this.filters.filterData = currentData || [];
      this.filters.showChangesButton = this.filters.filterData.some((filter: any) => filter.label === 'Status');
      this.filters.showActionButton = isDraftsUrl;
    });
  }

  onPageChange(event: any) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.currentPage = event.page - 1;
    this.getList(); 
  }

  receiveSearchResults(event: string) {
    this.filters.search = event.trim().toLowerCase();
    this.pagination.currentPage = 0;
    this.paginationComponent.resetToFirstPage();
  }

  onFilterChange(event: any) {
     if (['A to Z', 'Z to A', 'Latest first', 'Oldest first'].includes(event)) {
      switch (event) {
        case 'A to Z':
          this.sortOptions.sort_by = 'title';
          this.sortOptions.sort_order = 'asc';
          break;
        case 'Z to A':
          this.sortOptions.sort_by = 'title';
          this.sortOptions.sort_order = 'desc';
          break;
        case 'Latest first':
          this.sortOptions.sort_by = 'created_at';
          this.sortOptions.sort_order = 'asc';
          break;
        case 'Oldest first':
          this.sortOptions.sort_by = 'created_at';
          this.sortOptions.sort_order = 'desc';
          break;
        default:
          this.sortOptions.sort_by = '';
          this.sortOptions.sort_order = '';
      }
    } else {
      this.filters.current.type = event;
    }
    this.pagination.currentPage = 0;
    this.paginationComponent.resetToFirstPage();
  }

  getList() {
    this.formService.getResourceList(this.pagination, this.filters, this.sortOptions).subscribe(response => {
      const result = response.result || { data: [], count: 0 };
      this.lists = result.data.map(this.addActionButtons);
      this.filters.filteredLists = this.lists;
      this.pagination.totalCount = result.count;
    });
  }
  
  addActionButtons(item: any): any {
    item.actionButton = item.actionButton || [
      { action: 'EDIT', label: 'Edit', background_color: '#0a4f9d'  },
      { action: 'DELETE', label: 'Delete', background_color:'#EC555D' }
    ];
    return item;
  }

}
