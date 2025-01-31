import { DIALOG_DATA, DialogModule, DialogRef } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'batchrelease-dialog',
    templateUrl: 'cdbatchrelease-dialog.html',
    styleUrl: './batchrelease-dialog.css',
    imports: [
      CommonModule, FormsModule, DialogModule, MatFormFieldModule, MatTabsModule, MatInputModule]
  })
  export class BatchreleaseDialog {
    @Output() submitClicked = new EventEmitter<any>();
    data = inject(DIALOG_DATA);
    eus = ["EU","Non-EU","Non-TPL","Non-EU-TPL"];
    dialogRef = inject(DialogRef);
   
    save() {
      this.dialogRef.close(this.data.entry);
    }
  
  }