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

export class SettingsComponent {
   @ViewChild('messageboxDialog', { static: true }) messageboxDialog!: ElementRef<HTMLDialogElement>;
  constructor(
      private router: Router,
      private dataService: DataService,
      private messageService: MessageService
    ) {
      this.productfamilies = new MatTableDataSource(this.dataService.productfamilies);
      this.countries = this.dataService.countries;
      debugger;
      this.dataSource = new MatTableDataSource(this.countries);
    }

  items = ["Product Families", "Countries"];
  currentItem: any = [];
  productfamilies: any = [];
  countries: any = [];
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['country'];
  displayedColumnsP: string[] = ['Product_Family'];
  data: any = [];
  family = "";
  shortcut = "";
  country = "";
  currentId = "";
  filterVal = "";
  index = 0;
  mode = "";

  goHome() {
    this.router.navigate(['/']);
  }

  setItem(e: any) {
    this.currentId = e.id;
    if (this.index === 0) {
      this.family = e.Product_Family;
    } else {
      this.shortcut = e.shortcut;
      this.country = e.country;
    }
    this.currentItem = e;
  }

  saveData() {
    this.messageboxDialog.nativeElement.showModal(); 
    setTimeout(() => {
      this.messageboxDialog.nativeElement.close();
    }, 2000);
    let container = "";
    let entry: any;
    const id = this.createId();
    if (this.index === 0) {
      entry = {
        id: id,
        Product_Family: this.family
      };
      container = "Product_Families";
    }
    debugger;
    if (this.mode === "new") {
      this.dataService.addData("Product_Families", this.currentItem)
    } else {
      this.dataService.saveData(container, entry);
    }
  }

  filterData() {
    this.productfamilies.filter = this.filterVal;
    this.productfamilies.filterPredicate = (data: any, searchText: string) => {
      return data.Product_Family.toString().toUpperCase().includes(searchText.toUpperCase());
    };
  }

  clearFilter() {
    this.filterVal = "";
    this.filterData();
  }

  addData() {
    this.mode = "new";
    this.family = "new product family";
  }

  settingChange(i: number) {
    this.index = i;
  }

  deleteItem() {
    debugger;
    this.dataService.deleteItem("Product_Families", this.currentId);
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
}

