import { Component, ElementRef, ViewChild } from '@angular/core';
import { MaterialModule } from '../material.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { DataService } from '../services/dataService';
import { MatTableDataSource } from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageboxDialog } from '../dialogs/messageboxDialog.component';
import { MessageService } from '../services/messageService';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  imports: [
    MaterialModule, 
    MatGridListModule, 
    CommonModule,
    FormsModule,
    MessageboxDialog
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})

export class SettingsComponent implements OnInit {
   @ViewChild('messageboxDialog', { static: true }) messageboxDialog!: ElementRef<HTMLDialogElement>;
  constructor(
      private router: Router,
      private dataService: DataService,
      private messageService: MessageService
    ) {
      this.productfamilies = new MatTableDataSource(this.dataService.productfamilies);
      this.countries = new MatTableDataSource(this.dataService.countries);
      this.ptypes = new MatTableDataSource(this.dataService.ptypes);
      this.austatus = new MatTableDataSource(this.dataService.austatus);
      this.creators = new MatTableDataSource(this.dataService.creators);
      this.manufacturers = new MatTableDataSource(this.dataService.manufacturers);
      this.apimanufacturers = new MatTableDataSource(this.dataService.apimanufacturers);
      this.categories = new MatTableDataSource(this.dataService.categories);
      this.releasesites = new MatTableDataSource(this.dataService.releasesites);
      this.abbreviations = new MatTableDataSource(this.dataService.abbreviations);
      this.eus = new MatTableDataSource(this.dataService.eus);
      this.status = new MatTableDataSource(this.dataService.status);
    }

  items = ["Product Families", "Countries", "Procedure Types", "Authorisation Status", 
    "Creators / Modifiers", "Manufacturers", "API Manufacturers", "Categories", "Release Sites", "Abbreviations", "EU / Non EU", "Status"];
  currentItem: any = [];
  productfamilies: any = [];
  countries: any = [];
  ptypes: any = [];
  austatus: any = [];
  creators: any = [];
  manufacturers: any = [];
  apimanufacturers: any = [];
  categories: any = [];
  abbreviations: any = [];
  eus: any = [];
  status: any = [];
  releasesites: any = [];
  displayedColumns: string[] = ['shortcut','country'];
  displayedColumnsP: string[] = ['Product_Family'];
  displayedColumnsPt: string[] = ['ptype'];
  displayedColumnsAu: string[] = ['austatus'];
  displayedColumnsC: string[] = ['creator'];
  displayedColumnsM: string[] = ['Manufacturer'];
  displayedColumnsAPI: string[] = ['API_Manufacturer'];
  displayedColumnsCat: string[] = ['category'];
  displayedColumnsRS: string[] = ['release_site'];
  displayedColumnsAbb: string[] = ['abbreviation','content'];
  displayedColumnsEus: string[] = ['content'];
  displayedColumnsStatus: string[] = ['content'];
  data: any = [];
  family = "";
  ptype = "";
  austat = "";
  crea = "";
  manufacturer = "";
  apimanufacturer = "";
  category = "";
  abbreviation = "";
  releasesite = "";
  shortcut = "";
  country = "";
  content = "";
  currentId = "";
  filterVal = "";
  index = 0;
  mode = "";
  message = "";
  messageIndex = 0;
  disabled = true;
  model = {name: "family"};
  ngOnInit() {
  }

  goHome() {
    this.router.navigate(['/']);
  }

  setItem(e: any) {
    this.disabled = false;
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
      case 5: 
        this.manufacturer = e.Manufacturer;
        break;
      case 6: 
        this.apimanufacturer = e.API_Manufacturer;
        break;
      case 7: 
        this.category = e.category;
        break;
      case 8: 
        this.releasesite = e.release_site;
        break;
      case 9: 
      case 10: 
      case 11: 
        this.abbreviation = e.abbreviation;
        this.content = e.content;
        break;
    }
    this.currentItem = e;
  }

  saveData() {
    this.disabled = true;
    this.messageIndex = 0;
    this.message = "The changes were saved...";
    this.messageboxDialog.nativeElement.showModal(); 
    setTimeout(() => {
      this.messageboxDialog.nativeElement.close();
    }, 2000);

    let container = "";
    let entry: any;
    const id = this.createId();
    switch (this.index) {
      case 0:
        entry = {
          id:  this.mode === "new" ? id : this.currentId,
          Product_Family: this.family
        };
        container = "Product_Families";
        break;
      case 1:
        entry = {
          id:  this.mode === "new" ? id : this.currentId,
          shortcut: this.shortcut,
          country: this.country
        };
        container = "Countries";
        break;
      case 2:
        entry = {
          id:  this.mode === "new" ? id : this.currentId,
          ptype: this.ptype
        };
        container = "Procedure_Types";
        break;
      case 3:
        entry = {
          id:  this.mode === "new" ? id : this.currentId,
          austatus: this.austat
        };
        container = "Authorisation_Status";
        break;
      case 4:
        entry = {
          id:  this.mode === "new" ? id : this.currentId,
          creator: this.crea
        };
        container = "Creators";
        break;
      case 5:
        entry = {
          id:  this.mode === "new" ? id : this.currentId,
          Manufacturer: this.manufacturer
        };
        container = "Manufacturers";
        break;
      case 6:
        entry = {
          id:  this.mode === "new" ? id : this.currentId,
          API_Manufacturer: this.apimanufacturer
        };
        container = "API_Manufacturers";
        break;
      case 7:
        entry = {
          id:  this.mode === "new" ? id : this.currentId,
          category: this.category
        };
        container = "Categories";
        break;
      case 8:
        entry = {
          id:  this.mode === "new" ? id : this.currentId,
          release_site: this.releasesite
        };
        container = "Release_Sites";
        this.changeRS(this.currentId, this.releasesite)
        break;
      case 9:
        entry = {
          id:  this.mode === "new" ? id : this.currentId,
          abbreviation: this.abbreviation,
          content: this.content,
          index: 1
        };
        container = "Abbreviations";
        if (this.mode != "new") this.changeRS(this.currentId, this.abbreviation)
        break;
      case 10:
      case 11:
        entry = {
          id:  this.mode === "new" ? id : this.currentId,
          abbreviation: "",
          content: this.content,
          index: this.index == 10 ? 2 : 3
        };
        container = "Abbreviations";
        break;
      default:
        break;
    }
    if (this.mode === "new") {
      this.dataService.addData(container, entry);
      this.localInsert(entry);
    } else {
      debugger;
      this.dataService.saveData(container, entry);
      this.localUpdate(entry);
    }
  }
  changeRS(id: string, rsite: string) {
    let batches = this.dataService.batches;
    for ( let i = 0; i < batches.length; i++) {
      if (batches[i].release_site_id === id) {
        batches[i].RB_Site = rsite;
        this.dataService.saveData("Batches", batches[i]);
      }
    }
  }

  filterData() {
    switch(this.index) {
      case 0:
        this.productfamilies.filter = this.filterVal;
        this.productfamilies.filterPredicate = (data: any, searchText: string) => {
          return data.Product_Family.toString().toUpperCase().includes(searchText.toUpperCase());
        };
        break;
      case 1:
        this.countries.filter = this.filterVal;
        this.countries.filterPredicate = (data: any, searchText: string) => {
          return data.country.toString().toUpperCase().includes(searchText.toUpperCase());
        };
        break;
      case 2:
        this.ptypes.filter = this.filterVal;
        this.ptypes.filterPredicate = (data: any, searchText: string) => {
          return data.ptype.toString().toUpperCase().includes(searchText.toUpperCase());
        };
        break;
      case 3:
        this.austatus.filter = this.filterVal;
        this.austatus.filterPredicate = (data: any, searchText: string) => {
          return data.austatus.toString().toUpperCase().includes(searchText.toUpperCase());
        };
        break;
      case 4:
        this.creators.filter = this.filterVal;
        this.creators.filterPredicate = (data: any, searchText: string) => {
          return data.creator.toString().toUpperCase().includes(searchText.toUpperCase());
        };
        break;
      case 5:
        this.manufacturers.filter = this.filterVal;
        this.manufacturers.filterPredicate = (data: any, searchText: string) => {
          return data.Manufacturer.toString().toUpperCase().includes(searchText.toUpperCase());
        };
        break;
      case 6:
        this.apimanufacturers.filter = this.filterVal;
        this.apimanufacturers.filterPredicate = (data: any, searchText: string) => {
          return data.API_Manufacturer.toString().toUpperCase().includes(searchText.toUpperCase());
        };
        break;
      case 7:
        this.categories.filter = this.filterVal;
        this.categories.filterPredicate = (data: any, searchText: string) => {
          return data.category.toString().toUpperCase().includes(searchText.toUpperCase());
        };
        break;
      case 8:
        this.releasesites.filter = this.filterVal;
        this.releasesites.filterPredicate = (data: any, searchText: string) => {
          return data.release_site.toString().toUpperCase().includes(searchText.toUpperCase());
        };
        break;
      case 9:
      case 10:
      case 11:
        this.abbreviations.filter = this.filterVal;
        this.abbreviations.filterPredicate = (data: any, searchText: string) => {
          return data.content.toString().toUpperCase().includes(searchText.toUpperCase())
            || data.abbreviation.toString().toUpperCase().includes(searchText.toUpperCase());
        };
        break;
      default:
        break;
    }
  }

  clearFilter() {
    this.filterVal = "";
    this.filterData();
  }

  addData() {
    this.disabled = false;
    this.mode = "new";
    if (this.index === 0) this.family = "new product family";
    if (this.index === 1) this.country = "new country";
    if (this.index === 2) this.ptype = "new procedure type";
    if (this.index === 3) this.austat = "new authorisation status";
    if (this.index === 4) this.crea = "new creator / modifier";
  }

  settingChange(i: number) {
    this.index = i;
  }

  deleteItem() {
    
    let pos;
    switch (this.index) {
      case 0:
        pos = this.productfamilies.data.findIndex((el: { id: any; }) => el.id === this.currentId);
        this.message = "Do you want to remove the product family '" + this.family + "'?";
        break;
      case 1:
        pos = this.countries.data.findIndex((el: { id: any; }) => el.id === this.currentId);
        this.message = "Do you want to remove the country '" + this.country + "'?";
        break;
      case 2:
        pos = this.ptypes.data.findIndex((el: { id: any; }) => el.id === this.currentId);
        this.message = "Do you want to remove the procedure type '" + this.ptype + "'?";
        break;  
      case 3:
        pos = this.austatus.data.findIndex((el: { id: any; }) => el.id === this.currentId);
        this.message = "Do you want to remove the authorisation status '" + this.austat + "'?";
        break;  
      case 4:
        pos = this.creators.data.findIndex((el: { id: any; }) => el.id === this.currentId);
        this.message = "Do you want to remove the creator / modifier '" + this.crea + "'?";
        break;  
      case 9:
        pos = this.abbreviations.data.findIndex((el: { id: any; }) => el.id === this.currentId);
        this.message = "Do you want to remove the abbreviation '" + this.abbreviation + "'?";
        break;        
    }
    this.messageIndex = 1;
    this.messageboxDialog.nativeElement.showModal();
  }

  deleteProductFamily() {
    const pos = this.productfamilies.data.findIndex((el: { id: any; }) => el.id === this.currentId);
    debugger;
    if (pos >= 0) {
      this.productfamilies.data.splice(pos, 1);
      this.productfamilies.data = this.productfamilies.data;
    }
    this.dataService.deleteItem("Product_Families", this.currentId);
  }

  deleteCountry() {
    const pos = this.countries.data.findIndex((el: { id: any; }) => el.id === this.currentId);
    if (pos >= 0) {
      this.countries.data.splice(pos, 1);
      this.countries.data = this.countries.data;
    }
    this.dataService.deleteItem("Countries", this.currentId);
  }

  deletePtype() {
    const pos = this.ptypes.data.findIndex((el: { id: any; }) => el.id === this.currentId);
    if (pos >= 0) {
      this.ptypes.data.splice(pos, 1);
      this.ptypes.data = this.ptypes.data;
    }
    this.dataService.deleteItem("Procedure_Types", this.currentId);
  }

  deleteAustatus() {
    const pos = this.austatus.data.findIndex((el: { id: any; }) => el.id === this.currentId);
    if (pos >= 0) {
      this.austatus.data.splice(pos, 1);
      this.austatus.data = this.austatus.data;
    }
    this.dataService.deleteItem("Authorisation_Status", this.currentId);
  }

  deleteCreator() {
    const pos = this.creators.data.findIndex((el: { id: any; }) => el.id === this.currentId);
    if (pos >= 0) {
    const pos = this.creators.data.findIndex((el: { id: any; }) => el.id === this.currentId);
      this.creators.data.splice(pos, 1);
      this.creators.data = this.creators.data;
    }
    this.dataService.deleteItem("Creators", this.currentId);
  }

  deleteAbbreviation() {
    const pos = this.abbreviations.data.findIndex((el: { id: any; }) => el.id === this.currentId);
    if (pos >= 0) {
    const pos = this.abbreviations.data.findIndex((el: { id: any; }) => el.id === this.currentId);
      this.abbreviations.data.splice(pos, 1);
      this.abbreviations.data = this.abbreviations.data;
    }
    this.dataService.deleteItem("Abbreviations", this.currentId);
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

  localUpdate(e: any) {
    let item;
    switch (this.index) {
      case 0:
        item = this.productfamilies.data.find((o: { id: any; }) => o.id === e.id)
        item.Product_Family = e.Product_Family;
        break;
      case 1:
        item = this.countries.data.find((o: { id: any; }) => o.id === e.id)
        item.shortcut = e.shortcut;
        item.country = e.country;
        break;
      case 2:
        item = this.ptypes.data.find((o: { id: any; }) => o.id === e.id)
        item.ptype = e.ptype;
        break;
      case 3:
        item = this.austatus.data.find((o: { id: any; }) => o.id === e.id)
        item.austatus = e.austatus;
        break;
      case 4:
        item = this.creators.data.find((o: { id: any; }) => o.id === e.id)
        item.creator = e.creator;
        break;
      case 5:
        item = this.manufacturers.data.find((o: { id: any; }) => o.id === e.id)
        item.Manufacturer = e.Manufacturer;
        break;
      case 6:
        item = this.apimanufacturers.data.find((o: { id: any; }) => o.id === e.id)
        item.API_Manufacturer = e.API_Manufacturer;
        break;
      case 7:
        item = this.categories.data.find((o: { id: any; }) => o.id === e.id)
        item.category = e.category;
        break;
      case 8:
        item = this.releasesites.data.find((o: { id: any; }) => o.id === e.id)
        item.release_site = e.release_site;
        break;
      case 9:
        item = this.abbreviations.data.find((o: { id: any; }) => o.id === e.id)
        item.abbreviation = e.abbreviation;
        item.content = e.content;
        break;
      case 10:
        item = this.eus.data.find((o: { id: any; }) => o.id === e.id)
        item.content = e.content;
        break;
      case 11:
        item = this.status.data.find((o: { id: any; }) => o.id === e.id)
        item.content = e.content;
        break;
    }
  }
 
  localInsert(e: any) {
    switch (this.index) {
      case 0:
        this.productfamilies.data.push(e);
        this.productfamilies.data = this.productfamilies.data;
        break;
      case 1:
        this.countries.data.push(e);
        this.countries.data = this.countries.data;
        break;
      case 2:
        this.ptypes.data.push(e);
        this.ptypes.data = this.ptypes.data;
        break;
      case 3:
        this.austatus.data.push(e);
        this.austatus.data = this.austatus.data;
        break;
      case 4:
        this.creators.data.push(e);
        this.creators.data = this.creators.data;
        break;
    }

  }

  cancelMessage(e: any) {
    if (e === 1) {
      if (this.index === 0) this.deleteProductFamily();
      if (this.index === 1) this.deleteCountry();
      if (this.index === 2) this.deletePtype();
      if (this.index === 3) this.deleteAustatus();
      if (this.index === 4) this.deleteCreator();
      if (this.index === 9) this.deleteAbbreviation();
    }
    this.messageboxDialog.nativeElement.close();
  }
}

