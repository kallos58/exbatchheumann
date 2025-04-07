import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MaterialModule } from '../material.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterOutlet, Router } from '@angular/router';
import { DataService } from '../services/dataService';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from "@angular/material/sort";

import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageboxDialog } from '../dialogs/messageboxDialog.component';
import { MessageService } from '../services/messageService';
import { OnInit } from '@angular/core';
import * as Cosmos from "@azure/cosmos";
import { FilterBatchDialog } from '../dialogs/filterBatchDialog.component';
import { CdkDialog } from '../batchrelease/cdk-dialog';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-articlemaster',
  imports: [
    MaterialModule, 
    MatGridListModule, 
    CommonModule,
    FormsModule,
    MessageboxDialog,
    RouterOutlet,
    FilterBatchDialog
  ],
  templateUrl: './articlemaster.component.html',
  styleUrl: './articlemaster.component.css'
})

export class ArticleMasterComponent implements OnInit {
  @ViewChild('messageboxDialog', { static: true }) messageboxDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('filterBatchDialog', { static: true }) filterBatchDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  constructor(
      private router: Router,
      private dataService: DataService,
      private messageService: MessageService
    ) {
      this.articlemaster = new MatTableDataSource(this.dataService.articlemaster);
      this.batches = new MatTableDataSource(this.dataService.batches);
      this.createBatchesForFilter();
      this.batches2 = new MatTableDataSource(this.batchesForFilter);
      this.releasesites = this.dataService.releasesites;
      this.isNotAllowedUser = this.dataService.isNotAllowedUser;
    }

    endpoint = "https://schruefer.documents.azure.com:443/";
    key = "ZE8r1ZNlJuL7o1F10F5NuPlJgJiC2TElldQycH2QCxIaZzkGcnxA5Za3URdElQM8ef66ctGmLNz1ACDbc9JuIA";
    client = new Cosmos.CosmosClient({endpoint: this.endpoint, key: this.key});
    database = "Heumann";
    db = this.client.database(this.database);

  items = ["Product Families", "Countries", "Procedure Types", "Authorisation Status", "Creators / Modifiers"];
  currentItem: any = [];
  batches: any = [];
  batches2: any = [];
  batchesForFilter: any = [];
  articlemaster: any = [];
  releasesites: any = [];
  displayedColumns: string[] = ['SAP_Mat_No','MA_No','MA_Name'];
  displayedColumnsBatch: string[] = ['FP_Batch_No','RB_Site','Status','Sample_Receipt_Date','RB_Mark_Date','RB_Sale_Date'];
  displayedColumnsBatchFilter: string[] = ['SAP_Mat_No','MA_Name','FP_Batch_No','RB_Site','Status','Sample_Receipt_Date','RB_Mark_Date','RB_Sale_Date'];
  readonly dialog = inject(Dialog);
  DialogRef: DialogRef<CdkDialog> | undefined;
  isNotAllowedUser = false;
  data: any = [];
  family = "";
  ptype = "";
  austat = "";
  crea = "";
  shortcut = "";
  country = "";
  currentId = "";
  currentIndex = 0;
  filterVal = "";
  batchfilterVal = "";
  index = 0;
  mode = "";
  message = "";
  messageIndex = 0;
  entries = "";
  batchentries = "";
  entriesLen = 99;
  filterMode = false;
  searchFields = ["FP Batch No.", "Release Blocking Site"];
  companies = ["Heumann", "Heunet"];
  batchesFiltered = "Batches filtered";
  filterBatch = false;
  filters = [ 
    {"index": 0, "value": "FP Batch Number", "selected": false},
    {"index": 1, "value": "Release Blocking Site", "selected": true},
    {"index": 2, "value": "Status", "selected": true},
    {"index": 3, "value": "Sample Receipt Date", "selected": true},
    {"index": 4, "value": "Release Block for Marketing Date", "selected": true},
    {"index": 5, "value": "Release Block for Sale Date", "selected": true}
];
  currentEntry = {
    'SAP_Mat_No': '',
    'MA_Name': '',
    'MA_No': '',
    'Company': '',
    'Packsize': '',
    'Manufacturer': '',
    'EU': '',
    'API_Manufacturer': '',
    'NTIN': ''
  }

  ngOnInit() {
    this.entries = this.dataService.articlemaster.length + " entries";
    this.batchesFiltered = "Batches filtered (" + this.dataService.batches.length.toString() + " entries)";
  }

  announceSortChange(sortState: Sort) {
    this.articlemaster.sort = this.sort;
  }

  async setSelected(e: any) {
    this.currentId = e.id;
    this.currentEntry.SAP_Mat_No = e.SAP_Mat_No;
    this.currentEntry.MA_Name = e.MA_Name;
    this.currentEntry.MA_No = e.MA_No;
    this.currentEntry.Company = e.Company;
    this.currentEntry.Packsize = e.Packsize;
    this.currentEntry.NTIN = e.NTIN;
    this.getManufacturer(e.manufacturer);
    this.getAPIManufacturer(e.apimanufacturer);
    this.filterBatches(e.SAP_Mat_No);
  }

  showFilterBatchDialog(index: number) {
    this.filters[0].selected = index == 0 ? true : false;
    this.filters[1].selected = index == 1 ? true : false;
    this.filters[2].selected = index == 2 ? true : false;
    this.filters[3].selected = index == 3 ? true : false;
    this.filters[4].selected = index == 4 ? true : false;
    this.currentIndex = index;
    this.filterMode = true;
    this.filterBatchDialog.nativeElement.showModal();  
  }

  showEditBatchDialog(e: any) {
    this.currentId = e.id;
    for ( let i = 0; i < this.dataService.batchrelease.length; i++ ) {
      if (this.dataService.batchrelease[i].FP_Batch_no__ == e.FP_Batch_No) {
        let entry = this.dataService.batchrelease[i];
        let api = this.dataService.apimanufacturers.find((e: { id: any; }) => e.id === this.dataService.batchrelease[i].API_Manufacturer_Id);
        entry.API_Manufacturer = api.API_Manufacturer;
        let manus = this.dataService.manufacturers.find((e: { id: any; }) => e.id === this.dataService.batchrelease[i].Manufacturer_Id);
        entry.Manufacturer = api.Manufacturer;
        debugger;
        const dialog = this.dialog.open(CdkDialog, {
          disableClose: true,
          width: '48em',
          data: {
            entry: entry,
            currentEu: "EU",
            apimanufacturers: this.dataService.apimanufacturers,
            manufacturers: this.dataService.manufacturers,
            releasesites: this.dataService.releasesites,
            categories: this.dataService.categories
          },
        });
        dialog.closed.subscribe(async data => {
          if (!data) return;
          this.currentItem = data;
          this.message = "The data was saved."
          this.messageboxDialog.nativeElement.showModal(); 
          setTimeout(() => {
            this.messageboxDialog.nativeElement.close();
          }, 2000);
          this.dataService.saveData("Batch_Release", this.currentItem);
          this.dataService.saveStatus(this.currentItem.FP_Batch_no__, this.currentItem.Status);
          let batch = this.batches.data.find((e: { FP_Batch_No: any; }) => e.FP_Batch_No === this.currentItem.FP_Batch_no__);
          batch.Status = this.currentItem.Status;
          let date = this.currentItem.Sample_Receipt_date.slice(0,2) + "." + 
          this.currentItem.Sample_Receipt_date.slice(3,5) + "." + this.currentItem.Sample_Receipt_date.slice(8,10);
          batch.Sample_Receipt_Date = date;
          date = this.currentItem.Release__Block_for_Marketing_date.slice(0,2) + "." + 
          this.currentItem.Release__Block_for_Marketing_date.slice(3,5) + "." + this.currentItem.Release__Block_for_Marketing_date.slice(8,10);
          batch.RB_Mark_Date = date;
          date = this.currentItem.Release__Block_for_Sale_date.slice(0,2) + "." + 
          this.currentItem.Release__Block_for_Sale_date.slice(3,5) + "." + this.currentItem.Release__Block_for_Sale_date.slice(8,10);
          batch.RB_Sales_Date = date;
        });
        break;
      }
    }       
  }
  
  createIds() {
    let abbreviations = this.dataService.abbreviations;
    let batchrelease = this.dataService.batchrelease;
    
    for (let i = 0; i < batchrelease.length; i++) {
      //let entry = {
        //id: this.createId(),
        //abbreviation: "",
        //content: eus[i],
        //index: 3
      //};
      //abbreviations[i].index = 1;
      let item = abbreviations.find((e: { abbreviation: any; }) => e.abbreviation === batchrelease[i].BRRor_resp_);
      debugger;
      if (item) {
        batchrelease[i].BRRor_resp_id = item.id;
      } else {
        item = abbreviations.find((e: { abbreviation: any; }) => e.abbreviation === "empty");
        batchrelease[i].BRRor_resp_id = item.id;
      }
      //let item = rs.find((e: { release_site: any; }) => e.release_site === batchrelease[i].Release__Blocking_Site);
      //debugger;
      //if (item) {
        //item.release_site_id = batchrelease[i].release_site_id;
      //  let entry = batchrelease[i];
      //  entry.release_site_id = item.id
      //this.dataService.addData("Abbreviations", entry);
        //rs.push(entry);
        //let entry = batchrelease[i];
        //entry.release_site_id = item.id;
        //this.dataService.saveData("Batch_Release",entry);
        //batch.Manufacturer_Id = item.id;
     this.dataService.saveData("Batch_Release", batchrelease[i]);
     // }
    }
  }
  emitFilterOneCol(e: any) {
    if (this.filterMode) {
      this.createBatchesForFilter();
      this.batches2 = new MatTableDataSource(this.batchesForFilter);
      this.filterMode = false;
    }
   this.filterBatchDialog.nativeElement.close();
   this.filterBatch = true;
   this.filterBatchField(e.searchVal, e.index, e.fromDate, e.toDate);
  }

  async getManufacturer(id: string): Promise<any>  {
    let container = this.db.container("Manufacturers");
    let query = "SELECT * from c WHERE c.id = '" + id + "'";
    try {
      await container.items
      .query({
          query: query
      })
      .fetchAll()
      .then((response: any) => {
        this.currentEntry.Manufacturer = response.resources[0].Manufacturer;
        this.currentEntry.EU = response.resources[0].EU;
      }) 
    } catch(error) {
      console.log(error);
      return "";
    }    
  }
  
  createBatchesForFilter() {
    this.batchesForFilter = [];
    this.dataService.batches.forEach((item: any) => {
      let entry = item;
      let srdate = this.formatDateForFilter(entry.Sample_Receipt_Date);
      entry.Sample_Receipt_Date_T = srdate;
      let rbmdate = this.formatDateForFilter(entry.RB_Mark_Date);
      entry.RB_Mark_Date_T = rbmdate;
      let rbsdate = this.formatDateForFilter(entry.RB_Sale_Date);
      entry.RB_Sale_Date_T = rbsdate;
      let article;
      for ( let i = 0; i < this.articlemaster.data.length; i++) {
        if (this.articlemaster.data[i].SAP_Mat_No === entry.SAP_Mat_No.toString()) {
          article = this.articlemaster.data[i];
          break;
        }
      }
      if (article) entry.MA_Name = article.MA_Name;
      this.batchesForFilter.push(entry);
    });
  }

  formatDateForFilter(date: string) {
    let sliceDate = "20" + date.slice(6,8) + date.slice(3,5) + date.slice(0,2);
    let floatDate = parseFloat(sliceDate);
    return floatDate;
  }

  async getAPIManufacturer(id: string): Promise<any>  {
    let container = this.db.container("API_Manufacturers");
    let query = "SELECT * from c WHERE c.id = '" + id + "'";
    try {
      await container.items
      .query({
          query: query
      })
      .fetchAll()
      .then((response: any) => {
        this.currentEntry.API_Manufacturer = response.resources[0].API_Manufacturer;
      }) 
    } catch(error) {
      console.log(error);
      return "";
    }    
  }

  goHome() {
    this.router.navigate(['/']);
  }

  setItem(e: any) {
    this.currentId = e.id;
    switch (this.index) {
      case 0: 
        this.family = e.Product_Family;
        break;
      case 1: 
        this.shortcut = e.shortcut;
        this.country = e.country;
        break;
      case 2: 
        this.ptype = e.ptype;
        break;
      case 3: 
        this.austat = e.austatus;
        break;
      case 4: 
        this.crea = e.creator;
        break;
    }
    this.currentItem = e;
  }

  

  filterData() {
    this.articlemaster.filter = this.filterVal;
        this.articlemaster.filterPredicate = (data: any, searchText: string) => {
          return data.SAP_Mat_No.toString().includes(searchText) ||
          data.MA_Name.toString().toUpperCase().includes(searchText.toUpperCase())||
          data.MA_No.toString().toUpperCase().includes(searchText.toUpperCase());
        };
    this.entries = this.articlemaster.filteredData.length + " filtered entries";
    this.entriesLen = this.articlemaster.filteredData.length;
  }

  filterBatches(id: string) {
    this.batches.filter = id;
    this.batches.filterPredicate = (data: any, searchText: string) => {
      return data.SAP_Mat_No.toString().includes(searchText) ;
    };
    this.batchentries = this.batches.filteredData.length + " entries";
  }

  filterBatchField(searchVal: string, index: number, fromDate: string, toDate: string) {
    let fromTo = false;
    if (index == 3 || index == 4 || index == 5) {
      if (!toDate) {
        searchVal = fromDate;
      } else {
        fromTo = true;
        searchVal = fromDate + toDate;
      }
    }
    let dataToReturn;
    this.batches2.filter = searchVal;

    switch (index) {
      case 0:
        this.batches2.filterPredicate = (data: any, searchText: string) => {
          return data.FP_Batch_No.toString().toUpperCase().includes(searchText.toUpperCase()) ;
        };
        break;
      case 1:
        this.batches2.filterPredicate = (data: any, searchText: string) => {
          return data.RB_Site.toString().includes(searchText) ;
        };
        break;
      case 2:
        this.batches2.filterPredicate = (data: any, searchText: string) => {
          return data.Status.includes(searchText) ;
        };
        break;     
      case 3:
        if (!fromTo) {
          this.batches2.filterPredicate = (data: any, searchText: string) => {    
            dataToReturn = false;
            if (this.transformDate(data.Sample_Receipt_Date).includes(searchText)) dataToReturn = true;
            return dataToReturn;
          };
        }  else {
          this.batches2.filterPredicate = (data: any, searchText: string) => {    
            dataToReturn = false;
            let from = this.transformSearchval(searchVal, 0, 10);
            let to = this.transformSearchval(searchVal, 10, 20);
            if (data.Sample_Receipt_Date_T >= from && data.Sample_Receipt_Date_T <= to) dataToReturn = true;
            return dataToReturn;
          };
        } 
        break;   
      case 4:
        if (!fromTo) {
          this.batches2.filterPredicate = (data: any, searchText: string) => {    
            dataToReturn = false;
            if (this.transformDate(data.RB_Mark_Date).includes(searchText)) dataToReturn = true;
            return dataToReturn;
          };
        }  else {
          this.batches2.filterPredicate = (data: any, searchText: string) => {    
            dataToReturn = false;
            let from = this.transformSearchval(searchVal, 0, 10);
            let to = this.transformSearchval(searchVal, 10, 20);
            if (data.RB_Mark_Date_T >= from && data.RB_Mark_Date_T <= to) dataToReturn = true;
            return dataToReturn;
          };
        } 
        break;   
      case 5:
      if (!fromTo) {
        this.batches2.filterPredicate = (data: any, searchText: string) => {    
          dataToReturn = false;
          if (this.transformDate(data.RB_Sale_Date).includes(searchText)) dataToReturn = true;
          return dataToReturn;
        };
      }  else {
        this.batches2.filterPredicate = (data: any, searchText: string) => {    
          dataToReturn = false;
          let from = this.transformSearchval(searchVal, 0, 10);
          let to = this.transformSearchval(searchVal, 10, 20);
          if (data.RB_Sale_Date_T >= from && data.RB_Sale_Date_T <= to) dataToReturn = true;
          return dataToReturn;
        };
      } 
      break;   
       
      default:
        break;
    }
    this.batchesFiltered = "Batches filtered (" + this.batches2.filteredData.length.toString() + " entries)";
  }

  transformSearchval(searchval: string, x: number, y: number) {
    let sliceDate1 = searchval.slice(x,y);
    let sliceDate2 = sliceDate1.replace("-","");
    sliceDate2 = sliceDate2.replace("-","");
    return parseFloat(sliceDate2);
  }
  
  transformDate(date: string) {  
    return "20" + date.slice(6,8) + "-" +  date.slice(3,5) + "-" +  date.slice(0,2)
  }

  clearFilter() {
    this.filterVal = "";
    this.filterData();
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

  cancelMessage(e: any) {
    this.messageboxDialog.nativeElement.close();
  }
}

