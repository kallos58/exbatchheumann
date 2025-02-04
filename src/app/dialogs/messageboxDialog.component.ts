import { Component } from '@angular/core';
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
 
    
  
    constructor(
        
    ) {}  
  
   
}
