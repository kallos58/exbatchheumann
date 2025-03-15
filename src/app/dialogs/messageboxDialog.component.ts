import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

@Component({
    selector: 'messagebox-dialog',
    templateUrl: 'messageboxDialog.component.html',
    styleUrl: 'dialogs.css',
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule
    ]
})
export class MessageboxDialog {
 
    @Input() message: string = "";
    @Input() messageIndex: number = 0;
    @Output() cancelMessage = new EventEmitter<any>();
    constructor(
        
    ) {}  
  
    cancel(i: number) {
        debugger;
        this.cancelMessage.emit(i);
    }
   
}
