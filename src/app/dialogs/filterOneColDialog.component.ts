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
    @Output() childFilter = new EventEmitter<any>();
    searchVal = "";
    
  
    constructor(
        
    ) {}  
  
   close() {
    this.childFilter.emit({searchVal: this.searchVal});
   }

   changeSelect(e: any) {
    debugger;
   }
}
