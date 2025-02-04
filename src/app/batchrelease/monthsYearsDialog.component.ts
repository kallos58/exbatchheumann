import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

@Component({
    selector: 'months-years-dialog',
    templateUrl: 'monthsYearsDialog.component.html',
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule
    ]
})
export class MonthsYearsDialog {
 
    @Input() dmonth: string = "";
    @Input() dyear: string = "";
    @Input() index: number = 0;
    @Output() childCancel = new EventEmitter<any>();
    @Output() childSave = new EventEmitter<any>();
    months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    years = ["2020","2021","2022","2023","2024","2025","2026","2027","2028","2029","2030"];
  
    constructor(
        
    ) {}  
  
    close() {
        this.childCancel.emit();
    }

    save()  {
        debugger;
        this.childSave.emit({i: this.index, m: this.dmonth, y: this.dyear});
    }
}
