import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'lib-pagination',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() totalCount:any;
  @Input() setPaginatorToFirstpage:any
  @Output() paginatorChanged = new EventEmitter();
  pageSize = 5;
  pageSizeOptions = [5,10,20,100];
 
  onPageChange(event: any) {
    let data = {
      page: event.pageIndex + 1,
      pageSize: this.paginator.pageSize
    }
    this.paginatorChanged.emit(data);
  }
}
