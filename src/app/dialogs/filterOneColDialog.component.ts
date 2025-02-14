import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

@Component({
    selector: 'filter-one-col-dialog',
    templateUrl: 'filterOneColDialog.component.html',
    styleUrl: 'dialogs.css',
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule
    ]
})
export class FilterOneColDialog {
    @Input() currentCol: string = "";
    @Input() currentIndex: number = 0
    @Output() childFilter = new EventEmitter<any>();
    searchVal = "";
    filters = [ 
        {"index": 1, "value": "SAP Material Number"},
        {"index": 2, "value": "FP Batch Number"},
        {"index": 3, "value": "Bulk Batch Number"},
        {"index": 4, "value": "MA Name"}
    ];
    filterCol = "";
    constructor(
        
    ) {}  
  
   close() {
    const index = parseInt(this.currentCol);
    this.childFilter.emit({filter: true, searchVal: this.searchVal, index: this.currentIndex});
    this.close();
   }

   cancel() {
    this.childFilter.emit({filter: false, searchVal: this.searchVal, index: this.currentIndex});
    this.close();
   }

   clear() {
    this.searchVal = "";
    this.close();
   }

   changeFilter(e: any) {
    this.currentIndex = parseInt(e.currentTarget.value);
   }
}
