import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibProjectService {
  private dataSubject = new BehaviorSubject<any>(null);
  currentData = this.dataSubject.asObservable();

  constructor() { 
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }
}
