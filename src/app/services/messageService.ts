import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private dataSource = new BehaviorSubject<string>('');
  entries = this.dataSource.asObservable();
  private ds = new BehaviorSubject<string>('');
  index = this.ds.asObservable();
  
  changeData(data: string) {
    this.dataSource.next(data);
  }

  changeIndex(i: string) {
    this.ds.next(i);
  }
}