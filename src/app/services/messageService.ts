import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private dataSource = new BehaviorSubject<string>('');
  entries = this.dataSource.asObservable();

  changeData(data: string) {
    this.dataSource.next(data);
  }
}