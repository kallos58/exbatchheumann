import { Component, OnInit } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import * as Cosmos from "@azure/cosmos";

@Component({
  selector: 'app-batchrelease',
  imports: [MatSlideToggleModule],
  templateUrl: './batchrelease.component.html',
  styleUrl: './batchrelease.component.css'
})
export class BatchreleaseComponent implements OnInit {

  ngOnInit(): void {
      this.getBatchReleaseData();
  }

  async getBatchReleaseData() {
    const endpoint = "https://schruefer.documents.azure.com:443/";
    const key = "ZE8r1ZNlJuL7o1F10F5NuPlJgJiC2TElldQycH2QCxIaZzkGcnxA5Za3URdElQM8ef66ctGmLNz1ACDbc9JuIA";
    const client = new Cosmos.CosmosClient({endpoint: endpoint, key: key});
    const database = "Heumann";
    const db = client.database(database);
    const container = db.container("Categories");
    try {
      await container.items
      .query({
          query: "SELECT * from c"
      })
      .fetchAll()
      .then((response: any) => {
        console.log(response.resources);
      }) 
    } catch(error) {
      console.log(error);
    }    
  }

}
