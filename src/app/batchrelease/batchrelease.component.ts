import * as Cosmos from "@azure/cosmos";
import { CommonModule } from '@angular/common'
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';

import { Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild, inject, model, signal} from '@angular/core';
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
import {MatInputModule} from '@angular/material/input';
import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import {Dialog, DialogModule} from '@angular/cdk/dialog';
import { CdkDialog } from './cdk-dialog'
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
  readonly dialog = inject(Dialog);
  DialogRef: DialogRef<CdkDialog> | undefined;
  currentItem: any = [];
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
      }) 
    } catch(error) {
      console.log(error);
    }    
    
  }

  openDialog(e: any) {
    const dialog = this.dialog.open(CdkDialog, {
      disableClose: true,
      width: '48em',
      data: {
        entry: e,
        currentEu: "EU"
      },
    });
    dialog.closed.subscribe(async data => {
      this.currentItem = data;
      const endpoint = "https://schruefer.documents.azure.com:443/";
      const key = "ZE8r1ZNlJuL7o1F10F5NuPlJgJiC2TElldQycH2QCxIaZzkGcnxA5Za3URdElQM8ef66ctGmLNz1ACDbc9JuIA";
      const client = new Cosmos.CosmosClient({endpoint: endpoint, key: key});
      const database = "Heumann";
      const db = client.database(database);
      const container = db.container("Batch_Release");
      await container
        .item(this.currentItem.id, this.currentItem.id)
        .replace(this.currentItem);
    });
  }

  
}

