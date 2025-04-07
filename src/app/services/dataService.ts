import { Injectable } from '@angular/core';
import * as Cosmos from "@azure/cosmos";
import * as batch_release_overview from '../../assets/json/batch_release_overview.json';
import * as statuslist from '../../assets/json/current_status_validation_list.json'
import * as capafollowup from '../../assets/json/capa_follow_up.json'

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { ngxCsv } from 'ngx-csv/ngx-csv';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root',
})

export class DataService  {
    endpoint = "https://schruefer.documents.azure.com:443/";
    key = "ZE8r1ZNlJuL7o1F10F5NuPlJgJiC2TElldQycH2QCxIaZzkGcnxA5Za3URdElQM8ef66ctGmLNz1ACDbc9JuIA";
    client = new Cosmos.CosmosClient({endpoint: this.endpoint, key: this.key});
    database = "Heumann";
    db = this.client.database(this.database);
    batchrelease: any = [];
    apimanufacturers: any = [];
    manufacturers: any = [];
    releasesites: any = [];
    categories: any = [];
    abbreviations: any = [];
    eus: any = [];
    status: any = [];
    productfamilies: any = [];
    countries: any = [];
    ptypes: any = [];
    austatus: any = [];
    creators: any = [];
    articlemaster: any = [];
    batches: any = [];
    isPassed = false;
    isNotAllowedUser = false;
    batchReleaseOverview: any = batch_release_overview;
    statuslist: any = statuslist;
    capaFollowup: any = capafollowup;
    getAllData() {
        this.getData("Batch_Release", 1);
        this.getData("API_Manufacturers", 2);
        this.getData("Manufacturers", 3);
        this.getData("Release_Sites", 4);
        this.getData("Categories", 5);
        this.getData("Product_Families", 6);
        this.getData("Countries", 7);
        this.getData("Procedure_Types", 8);
        this.getData("Authorisation_Status", 9);
        this.getData("Creators", 10);
        this.getData("Article_Master", 11);
        this.getData("Batches", 12);
        this.getData("Abbreviations", 13);
        this.getData("Abbreviations", 14);
        this.getData("Abbreviations", 15);
    }

    async getData(c: string, i: number) {
        const container = this.db.container(c);
        let query;
        switch (i) {
          case 6:
            query = "SELECT * from c ORDER BY c.Product_Family";
            break;
          case 2:
            query = "SELECT * from c ORDER BY c.API_Manufacturer";
            break;
          case 3:
            query = "SELECT * from c ORDER BY c.Manufacturer";
            break;
          case 4:
            query = "SELECT * from c ORDER BY c.release_site";
            break;
          case 11:
            query = "SELECT * from c ORDER BY c.SAP_Mat_No";
            break;
          case 13:
            query = "SELECT * from c WHERE c.index=1 ORDER BY c.content";
            break;
          case 14:
            query = "SELECT * from c WHERE c.index=2 ORDER BY c.content";
            break;
          case 15:
            query = "SELECT * from c WHERE c.index=3 ORDER BY c.content";
            break;
          default:
            query = "SELECT * from c";
            break;

        }
        try {
          await container.items
          .query({
              query: query
          })
          .fetchAll()
          .then((response: any) => {
            if ( i === 1) this.batchrelease = response.resources;
            if ( i === 2) this.apimanufacturers = response.resources;
            if ( i === 3) this.manufacturers = response.resources;
            if ( i === 4) this.releasesites = response.resources;
            if ( i === 5) this.categories = response.resources;
            if ( i === 6) this.productfamilies = response.resources;
            if ( i === 7) this.countries = response.resources;
            if ( i === 8) this.ptypes = response.resources;
            if ( i === 9) this.austatus = response.resources;
            if ( i === 10) this.creators = response.resources;
            if ( i === 11) this.articlemaster = response.resources;
            if ( i === 12) this.batches = response.resources;
            if ( i === 13) this.abbreviations = response.resources;
            if ( i === 14) this.eus = response.resources;
            if ( i === 15) this.status = response.resources;
          }) 
        } catch(error) {
          console.log(error);
        }    
    }

    public async saveStatus(batchno: string, status: string) {
      const container = this.db.container("Batches");
      const query = "SELECT * from c WHERE c.FP_Batch_No = '" + batchno + "'";
      try {
        await container.items
        .query({
            query: query
        })
        .fetchAll()
        .then((response: any) => {
          let item = response.resources[0];
          item.Status = status;
          this.saveData("Batches", item);
        }) 
      } catch(error) {
        console.log(error);
      }    
    }

    public async saveData(c: string, item: any) {
        const container = this.db.container(c);
        try {
          await container
          .item(item.id, item.id)
          .replace(item);
        } catch(error) {
          console.log(error);
        } 
    }

    public async addData(c: string, entry: any) {
        //const id = this.createId();
        const container = this.db.container(c); 
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

  public exportAsExcelFile(data: any): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    // id	name	username	email
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, "data_");
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  public exportToCSV(data: any) {
    let formula = "data";
    let options = {
      title: 'User Details',
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: false,
      noDownload: false,
      showTitle: false,
      useBom: false,
    };

    const fileInfo = new ngxCsv(data, formula, options);

    console.log(fileInfo);
  }
}

function encodeBase64(csv: any) {
  throw new Error('Function not implemented.');
}
