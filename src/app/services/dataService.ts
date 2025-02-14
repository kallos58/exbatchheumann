import { Injectable, resource, signal } from '@angular/core';
import * as Cosmos from "@azure/cosmos";

@Injectable({
  providedIn: 'root',
})
export class DataService {
    private trigger = signal<void>(undefined);
    endpoint = "https://schruefer.documents.azure.com:443/";
    key = "ZE8r1ZNlJuL7o1F10F5NuPlJgJiC2TElldQycH2QCxIaZzkGcnxA5Za3URdElQM8ef66ctGmLNz1ACDbc9JuIA";
    client = new Cosmos.CosmosClient({endpoint: this.endpoint, key: this.key});
    database = "Heumann";
    db = this.client.database(this.database);
    batchrelase: any = [];
    getBatchrelase = resource({
        request: () => this.trigger,
        loader: async () => {  
            const container = this.db.container("Batch_Release");
            try {
                await container.items
                .query({
                    query: "SELECT * from c"
                })
                .fetchAll()
                .then((response: any) => {
                    this.batchrelase = response.resources;
                }) 
            } catch(error) {
                console.log(error);
            }    
        },
     });

    reload() {
        this.trigger.set(undefined);
    }
}