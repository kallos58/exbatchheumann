import { Injectable } from '@angular/core';
import * as Cosmos from "@azure/cosmos";
import * as batch_release_overview from '../../assets/json/batch_release_overview.json';
import * as responsibles from '../../assets/json/responsible_persons.json';
import * as priorities from '../../assets/json/priorities.json';
import * as statuslist from '../../assets/json/current_status_validation_list.json'
import * as capafollowup from '../../assets/json/capa_follow_up.json'
import * as manufacturers_extedo from '../../assets/json/manufacturers_extedo.json'

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
    isPassed = true;
    isNotAllowedUser = true;
    responsibles: any = responsibles;
    priorities: any = priorities;
    batchReleaseOverview: any = batch_release_overview;
    statuslist: any = statuslist;
    capaFollowup: any = capafollowup;
    manufacturersExtedo : any = manufacturers_extedo;
    concept_manufacturers: any = [];
    concept_companies: any = [];
    concept_statusbatchdocs: any = [];
    concept_eus: any = [];
    concept_rbsites: any = [];
    concept_categories: any = [];
    concept_master: any = [];
    concept_master_sapno: any = [];
    concept_batches: any = [];
    concept_status: any = [];
    concept_responsibles: any = [];
    concept_priorities: any = [];
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
        this.getManufacturers();
        this.getCompanies();
        this.getStatusBatchDocs();
        this.getEus();
        this.getRbsites();
        this.getCategories();
        this.getMaster();
        this.getMasterSAPNo();
        this.getStatus();
        this.getResponsibles();  
        this.getPriorities();
        this.getBatches();      
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

    async getManufacturers() {
      let data: any = [];
      this.concept_manufacturers = [];
      let entry;
      for (let i = 0; i < this.batchReleaseOverview.default.length; i++) {
        let manu = data.find((element: string) => element == this.batchReleaseOverview.default[i].Manufacturer);
        if (!manu) {
          let entry = {
            id: this.createId(),
            Manufacturer: this.batchReleaseOverview.default[i].Manufacturer
          };
          this.concept_manufacturers.push(entry);
          data.push(this.batchReleaseOverview.default[i].Manufacturer);
        }
        manu = data.find((element: string) => element == this.batchReleaseOverview.default[i].API_Manufacturer);
        if (!manu) {
          let entry = {
            id: this.createId(),
            Manufacturer: this.batchReleaseOverview.default[i].API_Manufacturer
          };
          this.concept_manufacturers.push(entry);
          data.push(this.batchReleaseOverview.default[i].API_Manufacturer);
        }
      }
    }

    async getCompanies() {
      let data: any = [];
      this.concept_companies = [];
      let entry;
      for (let i = 0; i < this.batchReleaseOverview.default.length; i++) {
        let company = data.find((element: string) => element == this.batchReleaseOverview.default[i].Company);
        if (!company) {
          let entry = {
            id: this.createId(),
            Company: this.batchReleaseOverview.default[i].Company
          };
          this.concept_companies.push(entry);
          data.push(this.batchReleaseOverview.default[i].Company);
        }
      }
    }

    async getStatusBatchDocs() {
      let data: any = [];
      this.concept_statusbatchdocs = [];
      let entry;
      for (let i = 0; i < this.batchReleaseOverview.default.length; i++) {
        let sbc = data.find((element: string) => element == this.batchReleaseOverview.default[i].Status_Batch_Docs);
        if (!sbc) {
          let entry = {
            id: this.createId(),
            Status_Batch_Docs: this.batchReleaseOverview.default[i].Status_Batch_Docs
          };
          this.concept_statusbatchdocs.push(entry);
          data.push(this.batchReleaseOverview.default[i].Status_Batch_Docs);
        }
      }
    }

    async getBatches() {
      let data: any = [];
      this.concept_batches = [];
      let entry;
      for (let i = 0; i < this.batchReleaseOverview.default.length; i++) {
        let rbsite = this.concept_rbsites.find((element: any) => element.RB_Site == this.batchReleaseOverview.default[i].RB_Site);
        let status, prio, category, sbc, BRRor_Resp, QAPM_Resp, QP_Resp;
        if (this.batchReleaseOverview.default[i].Status !== '') status = this.concept_status.find((element: any) => element.shortcut == this.batchReleaseOverview.default[i].Status);
        else status = this.concept_status.find((element: any) => element.shortcut == '(empty)');
        if (this.batchReleaseOverview.default[i].Prio !== '') prio = this.concept_priorities.find((element: any) => element.shortcut == String(this.batchReleaseOverview.default[i].Prio));
        else prio = this.concept_priorities.find((element: any) => element.shortcut == '(empty)');
        if (this.batchReleaseOverview.default[i].Category !== '') category = this.concept_categories.find((element: any) => element.shortcut == this.batchReleaseOverview.default[i].Category);
        else category = this.concept_categories.find((element: any) => element.Category == '(empty)');
        if (this.batchReleaseOverview.default[i].BRRor_Resp !== '') BRRor_Resp = this.concept_responsibles.find((element: any) => element.shortcut == this.batchReleaseOverview.default[i].BRRor_Resp);
        else BRRor_Resp = this.concept_responsibles.find((element: any) => element.shortcut == '(empty)');
        if (this.batchReleaseOverview.default[i].QAPM_Resp !== '') QAPM_Resp = this.concept_responsibles.find((element: any) => element.shortcut == this.batchReleaseOverview.default[i].QAPM_Resp);
        else QAPM_Resp = this.concept_responsibles.find((element: any) => element.shortcut == '(empty)');
        if (this.batchReleaseOverview.default[i].QP_Resp !== '') QP_Resp = this.concept_responsibles.find((element: any) => element.shortcut == this.batchReleaseOverview.default[i].QP_Resp);
        else QP_Resp = this.concept_responsibles.find((element: any) => element.shortcut == '(empty)');
        if (!category) category = this.concept_categories.find((element: any) => element.Category == '(empty)');
        sbc = this.concept_statusbatchdocs.find((element: any) => element.Status_Batch_Docs == this.batchReleaseOverview.default[i].Status_Batch_Docs);
        let entry = {
          id: this.createId(),
          SAP_Mat_No: this.batchReleaseOverview.default[i].SAP_Mat_No,
          MA_No: this.batchReleaseOverview.default[i].MA_No,
          FP_Batch_No: this.batchReleaseOverview.default[i].FP_Batch_No,
          Bulk_Batch_No: this.batchReleaseOverview.default[i].Bulk_Batch_No,
          Manufacturing_Date: this.batchReleaseOverview.default[i].Manufacturing_Date,
          Expiry_Date: this.batchReleaseOverview.default[i].Expiry_Date,
          Sample_Receipt_Date: this.batchReleaseOverview.default[i].Sample_Receipt_Date,
          RB_Marketing_Date: this.batchReleaseOverview.default[i].RB_Marketing_Date,
          RB_Sale_Date: this.batchReleaseOverview.default[i].RB_Sale_Date,
          RB_Site: this.batchReleaseOverview.default[i].RB_Site,
          RB_Site_Id: rbsite.id,
          Status_Shortcut: status.shortcut,
          Status_Id: status.id,
          BRRor_Resp_Id: BRRor_Resp.id,
          QAPM_Resp_Id: QAPM_Resp.id,
          QP_Resp_Id: QP_Resp.id,
          Priority_Id: prio.id,
          PrioMeeting: this.batchReleaseOverview.default[i].PrioMeeting_Release_Date,
          Category_Id: category.id,
          OGS_checked: this.batchReleaseOverview.default[i].OGS_checked,
          QA_Comment: this.batchReleaseOverview.default[i].QA_Comment,
          BRRor_QAPM_Date: this.batchReleaseOverview.default[i].BRRor_QAPM_Date,
          BRRor_Calc_Date: this.batchReleaseOverview.default[i].BRRor_Calc_Date,
          QAPM_Calc_Date: this.batchReleaseOverview.default[i].QAPM_Calc_Date,
          Status_Batch_Docs_Id: sbc.id,
          Batch_Docs_Date: this.batchReleaseOverview.default[i].Batch_Docs_Date,
          Docu_Comment: this.batchReleaseOverview.default[i].Docu_Comment,
          Consecutive_Number: this.batchReleaseOverview.default[i].Consecutive_Number,
          Temp_Eval_Completed: this.batchReleaseOverview.default[i].Temp_Eval_Completed,
          Lab_Chem: this.batchReleaseOverview.default[i].Lab_Chem,
          CoA_Chem_Exp: this.batchReleaseOverview.default[i].CoA_Chem_Exp,
          CoA_Chem_Rec: this.batchReleaseOverview.default[i].CoA_Chem_Rec,
          Lab_Add: this.batchReleaseOverview.default[i].Lab_Add,
          CoA_Add_Rec: this.batchReleaseOverview.default[i].CoA_Add_Rec,
          Reanalysis_Comment: this.batchReleaseOverview.default[i].Reanalysis_Comment
        };
        this.concept_batches.push(entry);
        data.push(this.batchReleaseOverview.default[i].Company);
      }
    }

    async getEus() {
      let data: any = [];
      this.concept_eus = [];
      let entry;
      for (let i = 0; i < this.batchReleaseOverview.default.length; i++) {
        let eu = data.find((element: string) => element == this.batchReleaseOverview.default[i].EU);
        if (!eu) {
          let entry = {
            id: this.createId(),
            EU: this.batchReleaseOverview.default[i].EU
          };
          this.concept_eus.push(entry);
          data.push(this.batchReleaseOverview.default[i].EU);
        }
      }
    }

    async getStatus() {
      this.concept_status = [];
      let entry = {
        id: this.createId(),
        shortcut: "(empty)",
        status: "(empty)"
      };
      this.concept_status.push(entry);
      entry = {
        id: this.createId(),
        shortcut: "F",
        status: "Freigabe"
      };
      this.concept_status.push(entry);
      entry = {
        id: this.createId(),
        shortcut: "S",
        status: "Status"
      };
      this.concept_status.push(entry);
    }

    async getRbsites() {
      let data: any = [];
      this.concept_rbsites = [];
      let entry;
      for (let i = 0; i < this.batchReleaseOverview.default.length; i++) {
        let rbsite = data.find((element: string) => element == this.batchReleaseOverview.default[i].RB_Site);
        if (!rbsite) {
          let entry = {
            id: this.createId(),
            RB_Site: this.batchReleaseOverview.default[i].RB_Site
          };
          this.concept_rbsites.push(entry);
          data.push(this.batchReleaseOverview.default[i].RB_Site);
        }
      }
    }

    async getResponsibles() {
      this.concept_responsibles = [];
      let entry;
      for (let i = 0; i < this.responsibles.default.length; i++) {
          let entry = {
            id: this.createId(),
            shortcut: this.responsibles.default[i].shortcut,
            responsible: this.responsibles.default[i].responsible
          };
          this.concept_responsibles.push(entry);
      }
    }

    async getPriorities() {
      this.concept_priorities = [];
      let entry;
      for (let i = 0; i < this.priorities.default.length; i++) {
          let entry = {
            id: this.createId(),
            shortcut: this.priorities.default[i].shortcut,
            priority: this.priorities.default[i].priority
          };
          this.concept_priorities.push(entry);
      }

    }

    async getCategories() {
      let data: any = [];
      this.concept_categories = [];
      for (let i = 0; i < this.batchReleaseOverview.default.length; i++) {
        if (this.batchReleaseOverview.default[i].Category === "") continue;
        let category = data.find((element: string) => element == this.batchReleaseOverview.default[i].Category);
        if (!category) {
          let entry = {
            id: this.createId(),
            Category: this.batchReleaseOverview.default[i].Category
          };
          this.concept_categories.push(entry);
          data.push(this.batchReleaseOverview.default[i].Category);
        }
      }
      let entry = {
        id: this.createId(),
        Category: '(empty)'
      };
      this.concept_categories.push(entry);
    }

    async getMaster() {
      let data: any = [];
      this.concept_master = [];
      let entry;
      for (let i = 0; i < this.batchReleaseOverview.default.length; i++) {
        let mano = data.find((element: string) => element == this.batchReleaseOverview.default[i].MA_No);
        if (!mano) {
          let company = this.concept_companies.find((element: any) => element.Company == this.batchReleaseOverview.default[i].Company);
          let manufacturer = this.concept_manufacturers.find((element: any) => element.Manufacturer == this.batchReleaseOverview.default[i].Manufacturer);
          let apimanufacturer = this.concept_manufacturers.find((element: any) => element.Manufacturer == this.batchReleaseOverview.default[i].API_Manufacturer);
          let eu = this.concept_eus.find((element: any) => element.EU == this.batchReleaseOverview.default[i].EU);
          let entry = {
            id: this.createId(),
            MA_No: this.batchReleaseOverview.default[i].MA_No,
            MA_Name: this.batchReleaseOverview.default[i].MA_Name,
            SAP_Mat_No: this.batchReleaseOverview.default[i].SAP_Mat_No,
            Company: company,
            Manufacturer: manufacturer,
            API_Manufacturer: apimanufacturer, 
            EU: eu,
            Packsize: this.batchReleaseOverview.default[i].Packsize,
            NTIN: this.batchReleaseOverview.default[i].NTIN
          };
          this.concept_master.push(entry);
          data.push(this.batchReleaseOverview.default[i].MA_No);
        }
      }
    }

    async getMasterSAPNo() {
      let data: any = [];
      this.concept_master_sapno = [];
      let entry, sappack;
      for (let i = 0; i < this.batchReleaseOverview.default.length; i++) {
        let sappack = String(this.batchReleaseOverview.default[i].SAP_Mat_No) + String(this.batchReleaseOverview.default[i].Packsize);
        let sapno = data.find((element: string) => element == sappack);
        if (!sapno) {
          let company = this.concept_companies.find((element: any) => element.Company == this.batchReleaseOverview.default[i].Company);
          let manufacturer = this.concept_manufacturers.find((element: any) => element.Manufacturer == this.batchReleaseOverview.default[i].Manufacturer);
          let apimanufacturer = this.concept_manufacturers.find((element: any) => element.Manufacturer == this.batchReleaseOverview.default[i].API_Manufacturer);
          let eu = this.concept_eus.find((element: any) => element.EU == this.batchReleaseOverview.default[i].EU);
          let entry = {
            id: this.createId(),
            SAP_Mat_No: String(this.batchReleaseOverview.default[i].SAP_Mat_No),
            MA_Name: this.batchReleaseOverview.default[i].MA_Name,
            Packsize: this.batchReleaseOverview.default[i].Packsize,
            Company: company,
            MA_No: this.batchReleaseOverview.default[i].MA_No,
            Manufacturer: manufacturer,
            API_Manufacturer: apimanufacturer, 
            EU: eu,
            NTIN: this.batchReleaseOverview.default[i].NTIN,
            filter: false
          };
          this.concept_master_sapno.push(entry);
          sappack = String(this.batchReleaseOverview.default[i].SAP_Mat_No) + String(this.batchReleaseOverview.default[i].Packsize);
          data.push(sappack);
        }
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
