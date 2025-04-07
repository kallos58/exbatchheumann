import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageboxDialog } from '../dialogs/messageboxDialog.component';
import { DataService } from '../services/dataService';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from "@angular/material/sort";
import { MessageService } from '../services/messageService';

import { CdkDialog } from '../batchrelease/cdk-dialog';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-current-status-mpv',
  imports: [
    MaterialModule, 
    MatGridListModule, 
    CommonModule,
    FormsModule,
    RouterOutlet,
    MessageboxDialog
  ],
  templateUrl: './current-status-mpv.component.html',
  styleUrl: './current-status-mpv.component.css'
})
export class CurrentStatusMpvComponent {
   @ViewChild('messageboxDialog', { static: true }) messageboxDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  constructor(
      private router: Router,
      private dataService: DataService,
      private messageService: MessageService
  ) {
    this.statuslist = this.dataService.statuslist.default;
    this.createId();
    this.createStatusListUnique();
    
  }
  message: string = "";
  statuslist: any = [];
  statuslistUnique: any = [];
  statuslistU: any = [];
  statuslistMPV: any = [];
  entriesLen = 99;
  displayedColumns: string[] = ['MA_No','Productname'];
  displayedColumnsMPV: string[] = ['Status','Dosageform','CMOSite','Reference','MPVReviewNo','ProcessValidationReport'];

  currentId: string = "";
  currentEntry: any = [];
  filterVal = "";
  statusfilterVal = "dummy";
  entries = "";
  currentItem: any = [];
  messageIndex = 0;
  companies = ["Heumann", "Heunet"];
  readonly dialog = inject(Dialog);
  DialogRef: DialogRef<CdkDialog> | undefined;
  
  goHome() {
    this.router.navigate(['/']);
  }

  announceSortChange(sortState: Sort) {
    this.statuslist.sort = this.sort;
  }

  createId() {
    this.statuslist.forEach((item: any) => {
      item.id = this.dataService.createId();
    });
    this.statuslistMPV = new MatTableDataSource(this.statuslist); 
  }

  createStatusListUnique() {
    this.statuslist.forEach((item: any) => {
      if (!this.statuslistUnique.find((element: any) => element.MA_No == item.MA_No)) {
        let entry = {
          id: item.id,
          MA_No: item.MA_No,
          Productname: item.Productname
        }
        this.statuslistUnique.push(entry);
      }
    });
    this.entries = this.statuslistUnique.length + " entries";
    this.statuslistU = new MatTableDataSource(this.statuslistUnique); 
  }

  setSelected(e: any) {
    this.currentId = e.id;
    this.statusfilterVal = e.MA_No;
    let item = this.dataService.articlemaster.find((element: any) => element.MA_No == e.MA_No);
    debugger;
    if (item) {
      this.currentEntry = item;
      let manufacturer = this.dataService.manufacturers.find((element: any) => element.id == item.manufacturer);
      this.currentEntry.Manufacturer = manufacturer.Manufacturer;
      this.currentEntry.EU = manufacturer.EU;
      let apimanufacturer = this.dataService.apimanufacturers.find((element: any) => element.id == item.apimanufacturer);
      this.currentEntry.API_Manufacturer = apimanufacturer.API_Manufacturer;
    } else this.currentEntry = [];
    this.filterStatus();
  }

  filterData() {
    this.statuslistU.filter = this.filterVal;
    this.statuslistU.filterPredicate = (data: any, searchText: string) => {
      return data.MA_No.toString().includes(searchText);
    };
    this.entries = this.statuslistU.filteredData.length + " filtered entries";
  }

  filterStatus() {
    this.statuslistMPV.filter = this.statusfilterVal;
    this.statuslistMPV.filterPredicate = (data: any, searchText: string) => {
      return data.MA_No.toString().includes(searchText);
    };
  }

  cancelMessage(e: any) {
    this.messageboxDialog.nativeElement.close();
  }
}
