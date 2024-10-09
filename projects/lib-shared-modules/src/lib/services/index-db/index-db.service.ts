import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class IndexDbService {

  constructor(private dbService: NgxIndexedDBService) {}

  addData(storeName: string, data: any) {
    return this.dbService.add(storeName, data);
  }

  getData(storeName: string, key: number) {
    return this.dbService.getByKey(storeName, key);
  }

  deleteData(storeName: string, key: number) {
    return this.dbService.delete(storeName, key);
  }

  updateData(storeName: string, data: any) {
    return this.dbService.update(storeName, data);
  }

  getAllData(storeName: string) {
    return this.dbService.getAll(storeName);
  }
}
