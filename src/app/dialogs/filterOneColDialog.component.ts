import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class FilterOneColDialog implements OnInit {
    @Input() currentCol: string = "";
    @Input() currentIndex: number = 0;
    @Input() apimanufacturers: any = [];
    @Input() manufacturers: any = [];
    @Output() childFilter = new EventEmitter<any>();
    searchVal = "";
    isClosed = false;
    filters = [ 
        {"index": 1, "value": "SAP Material Number"},
        {"index": 2, "value": "FP Batch Number"},
        {"index": 3, "value": "Bulk Batch Number"},
        {"index": 4, "value": "MA Name"},
        {"index": 5, "value": "MA-No"},
        {"index": 6, "value": "Company"},
        {"index": 7, "value": "API Manufacturers"},
        {"index": 8, "value": "Manufacturers"}
    ];
    filterCol = "";
    companies = [ 
        {"index": 1, "value": "Heumann"},
        {"index": 2, "value": "Heunet"}
    ];
    constructor(
        
    ) {}  
  
   ngOnInit(): void {
       this.isClosed = false;
   }

   close() {
    
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

   getCi() {
    return this.currentIndex <= 5 ? true : false;
   }
}
