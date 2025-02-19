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
    apimanufacturers: any = [];
    manufacturers: any = [];
    releasesites: any = [];
    categories: any = [];
    productfamilies: any = [];
    countries: any = [];
    
    getAllData() {
        this.getData("Batch_Release", 1);
        this.getData("API_Manufacturers", 2);
        this.getData("Manufacturers", 3);
        this.getData("Release_Sites", 4);
        this.getData("Categories", 5);
        this.getData("Product_Families", 6);
        this.getData("Countries", 7);
    }

    async getData(c: string, i: number) {
        const container = this.db.container(c);
        try {
          await container.items
          .query({
              query: i!=6 ? "SELECT * from c" : "SELECT * from c ORDER BY c.Product_Family"
          })
          .fetchAll()
          .then((response: any) => {
            if ( i === 1) this.batchrelase = response.resources;
            if ( i === 2) this.apimanufacturers = response.resources;
            if ( i === 3) this.manufacturers = response.resources;
            if ( i === 4) this.releasesites = response.resources;
            if ( i === 5) this.categories = response.resources;
            if ( i === 6) this.productfamilies = response.resources;
            if ( i === 7) this.countries = response.resources;
          }) 
        } catch(error) {
          console.log(error);
        }    
    }

    public async saveData(c: string, item: any) {
      debugger;
        const container = this.db.container(c);
        await container
        .item(item.id, item.id)
        .replace(item);
    }

    public async addData(c: string, entry: any) {
        //const id = this.createId();
        const container = this.db.container(c);
        //debugger;
        //const entry = {
        //    id: id,
        //    Product_Family: item.Product_Family
       // }  
        await container.items.create(entry);
    }

    public createId(): string {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      let result: string = "";
      while (counter < 35) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }

  async deleteItem(c: string, id: string) {
    const container = this.db.container(c);
    await container.item(id, id).delete();
  }
}