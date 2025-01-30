import * as Cosmos from "@azure/cosmos";
import { CommonModule } from '@angular/common'
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';

import { Component, OnInit, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import {Dialog, DialogModule} from '@angular/cdk/dialog';

@Component({
  selector: 'app-batchrelease',
  imports: [
    MatTableModule, 
    MatGridListModule, 
    MatIconModule, 
    CommonModule,
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, DialogModule],
  templateUrl: './batchrelease.component.html',
  styleUrl: './batchrelease.component.css'
})

export class BatchreleaseComponent implements OnInit {
  displayedColumns: string[] = ['SAP_Material_Number', 'FP_Batch_no__', 'Bulk_Batch_no_', 'MA_name_', 'Company'];
  dataSource: any = [];
  
  readonly dialog = inject(Dialog);;

  constructor() {}
 
  async ngOnInit() {
    const endpoint = "https://schruefer.documents.azure.com:443/";
    const key = "ZE8r1ZNlJuL7o1F10F5NuPlJgJiC2TElldQycH2QCxIaZzkGcnxA5Za3URdElQM8ef66ctGmLNz1ACDbc9JuIA";
    const client = new Cosmos.CosmosClient({endpoint: endpoint, key: key});
    const database = "Heumann";
    const db = client.database(database);
    const container = db.container("Batch_Release");
    try {
      await container.items
      .query({
          query: "SELECT * from c"
      })
      .fetchAll()
      .then((response: any) => {
        this.dataSource = response.resources;

        console.log(this.dataSource);
      }) 
    } catch(error) {
      console.log(error);
    }    
    
  }

  openDialog(e: any) {
    this.dialog.open(CdkDialogDataExampleDialog, {
      width: '48em',
      data: {
        entry: e,
        currentEu: "EU"
      },
    });
  }

  getRecord(e: any) {
    debugger;
  }
}

@Component({
  selector: 'cdk-dialog-data-example-dialog',
  templateUrl: 'cdk-dialog.html',
  styleUrl: './cdk-dialog.css',
  imports: [
    MatTableModule, 
    MatGridListModule, 
    MatIconModule, 
    CommonModule, MatTabsModule, MatSelectModule,
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, DialogModule]
})
export class CdkDialogDataExampleDialog {
  data = inject(DIALOG_DATA);
  eus = ["EU","Non-EU","Non-TPL","Non-EU-TPL"];
  dialogRef = inject(DialogRef);
  foods: any = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];
  save() {
    debugger;
    this.dialogRef.close();
  }

}