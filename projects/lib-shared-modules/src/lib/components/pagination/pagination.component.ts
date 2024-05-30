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
  @Output() paginatorChanged = new EventEmitter();
  @Input() pageSize:any = 5
  @Input() pageSizeOptions:Array<number>= [5,10,20,100]

  onPageChange(event: any) {
    this.emitPageChange(event.pageIndex);
  }

  emitPageChange(pageIndex: number) {
    let data = {
      page: pageIndex + 1,
      pageSize: this.paginator.pageSize
    };
    this.paginatorChanged.emit(data);
  }

  resetToFirstPage() {
    if (this.paginator) {
      this.paginator.firstPage();
      this.emitPageChange(0);
    }
  }
}
