import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common'
import {FormControl, FormsModule} from '@angular/forms';
import { MaterialModule } from '../material.module';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';

export const MY_FORMATS = {
    parse: {
      dateInput: 'DD.MM.YYYY',
    },
    display: {
      dateInput: 'DD.MM.YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };
  
@Component({
    selector: 'filter-batch-dialog',
    templateUrl: 'filterBatchDialog.component.html',
    styleUrl: 'dialogs.css',
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule
    ],
    providers: [ provideMomentDateAdapter(MY_FORMATS) ],
})
export class FilterBatchDialog implements OnInit {
    @Input() currentIndex: number = 0;
    @Input() filters: any = [];
    @Input() releasesites: any = [];
    @Output() childFilter = new EventEmitter<any>();
    searchVal = "";
    isClosed = false;
    status = ['F','S','U','(empty)'];
    fromDate = "";
    toDate = "";
    constructor(){ }  
  
    ngOnInit(): void {
        this.isClosed = false;
    }

    changeFilter(e: any) {
        this.currentIndex = parseInt(e.currentTarget.value);
    }

    close() {
        this.childFilter.emit({
            filter: true, 
            searchVal: this.searchVal, 
            index: this.currentIndex,
            fromDate: this.fromDate,
            toDate: this.toDate
        });
        this.close();
    }

    cancel() {
        this.childFilter.emit({filter: false, searchVal: this.searchVal});
        this.close();
    }

    clear() {
        this.searchVal = "";
        this.fromDate = "";
        this.toDate = "";
        this.close();
    }

}
