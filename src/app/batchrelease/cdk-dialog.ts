import { DIALOG_DATA, DialogModule, DialogRef } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'cdk-dialog',
    templateUrl: 'cdk-dialog.html',
    styleUrl: './cdk-dialog.css',
    imports: [
      CommonModule, FormsModule, DialogModule, MatFormFieldModule, MatTabsModule, MatInputModule, MatButtonModule]
  })
  export class CdkDialog {
    @Output() submitClicked = new EventEmitter<any>();
    data = inject(DIALOG_DATA);
    eus = ["EU","Non-EU","Non-TPL","Non-EU-TPL"];
    days = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    dialogRef = inject(DialogRef);
   
    save() {
      this.dialogRef.close(this.data.entry);
    }
  
  }