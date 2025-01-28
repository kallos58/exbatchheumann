import { Component, OnInit, Injectable, inject } from '@angular/core';
import * as Cosmos from "@azure/cosmos";
import { CommonModule } from '@angular/common'
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-batchrelease',
  imports: [MatTableModule, MatGridListModule, CommonModule],
  templateUrl: './batchrelease.component.html',
  styleUrl: './batchrelease.component.css'
})

export class BatchreleaseComponent implements OnInit {
  displayedColumns: string[] = ['SAP_Material_Number', 'FP_Batch_no__', 'Bulk_Batch_no_', 'MA_name_'];
  dataSource: any = [];

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

  

}
