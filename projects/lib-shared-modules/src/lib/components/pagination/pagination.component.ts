import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'lib-pagination',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnChanges{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() totalCount:any;
  @Input() setPaginatorToFirstpage:boolean = false;
  @Output() paginatorChanged = new EventEmitter();
  @Input() pageSize:any = 5
  @Input() pageSizeOptions:Array<number>= [5,10,20,100]

  ngOnChanges() {
    if(this.setPaginatorToFirstpage){
      this.paginator.firstPage();
    }
  }
  
  onPageChange(event: any) {
    let data = {
      page: event.pageIndex + 1,
      pageSize: this.paginator.pageSize
    }
    this.paginatorChanged.emit(data);
  }
}
