import { Component, EventEmitter, Output } from '@angular/core';
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

    selected: number = 0;
    constructor(
        
    ) {}  

    close() {
        this.childFilter.emit(1);
    }

    radioChange(e: any) {
        debugger;
    }
}
