import * as Cosmos from "@azure/cosmos";
import { CommonModule } from '@angular/common'
import {Component, OnInit, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Dialog, DialogModule, DialogRef} from '@angular/cdk/dialog';
import { CdkDialog } from './cdk-dialog';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-batchrelease',
  imports: [   
    CommonModule,
    FormsModule, DialogModule, MaterialModule],
  templateUrl: './batchrelease.component.html',
  styleUrl: './batchrelease.component.css'
})

export class BatchreleaseComponent implements OnInit {
  displayedColumns: string[] = ['SAP_Material_Number', 'FP_Batch_no__', 'Bulk_Batch_no_', 'MA_name_', 'Company'];
  dataSource: any = [];
  apiManufacturers: any = [];
  manufacturers: any = [];
  releasesites: any = [];
  readonly dialog = inject(Dialog);
  DialogRef: DialogRef<CdkDialog> | undefined;
  currentItem: any = [];
  endpoint = "https://schruefer.documents.azure.com:443/";
  key = "ZE8r1ZNlJuL7o1F10F5NuPlJgJiC2TElldQycH2QCxIaZzkGcnxA5Za3URdElQM8ef66ctGmLNz1ACDbc9JuIA";
  client = new Cosmos.CosmosClient({endpoint: this.endpoint, key: this.key});
  database = "Heumann";
  db = this.client.database(this.database);

  constructor() {}
  
  ngOnInit() {
    this.getBatchRelease();
    this.getAPIManufacturers();
    this.getManufacturers();
    this.getReleaseSites();
  }

  async getBatchRelease() {
    const container = this.db.container("Batch_Release");
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

  async getAPIManufacturers() {
    const container = this.db.container("API_Manufacturers");
    try {
      await container.items
      .query({
          query: "SELECT * from c"
      })
      .fetchAll()
      .then((response: any) => {
        this.apiManufacturers = response.resources;
      }) 
    } catch(error) {
      console.log(error);
    }    
  }

  async getManufacturers() {
    const container = this.db.container("Manufacturers");
    try {
      await container.items
      .query({
          query: "SELECT * from c"
      })
      .fetchAll()
      .then((response: any) => {
        this.manufacturers = response.resources;
      }) 
    } catch(error) {
      console.log(error);
    }    
  }

  async getReleaseSites() {
    const container = this.db.container("Release_Sites");
    try {
      await container.items
      .query({
          query: "SELECT * from c"
      })
      .fetchAll()
      .then((response: any) => {
        this.releasesites = response.resources;
      }) 
    } catch(error) {
      console.log(error);
    }    
  }

  openDialog(e: any) {
    debugger;
    const dialog = this.dialog.open(CdkDialog, {
      disableClose: true,
      width: '48em',
      data: {
        entry: e,
        currentEu: "EU",
        apimanufacturers: this.apiManufacturers,
        manufacturers: this.manufacturers,
        releasesites: this.releasesites
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

