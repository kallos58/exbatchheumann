import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/dataService';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from "@angular/material/sort";

import { CdkDialog } from '../batchrelease/cdk-dialog';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-capa-followup',
  imports: [
    MaterialModule, 
    MatGridListModule, 
    CommonModule,
    FormsModule,
    RouterOutlet
  ],
  templateUrl: './capa-followup.component.html',
  styleUrl: './capa-followup.component.css'
})
export class CapaFollowupComponent {
  constructor(
    private router: Router,
    private dataService: DataService) {
      this.capaFollowup = this.dataService.capaFollowup.default;
      this.createId();
      this.createCapaFollowupListUnique();
    }
 
  capaFollowup: any = [];
  capaFollowupList: any = [];
  capaFollowupListUnique: any = [];
  capaFollowupUniqueList: any = [];
  displayedColumnsSupplier: string[] = ['Supplier'];
  displayedColumnsFollowup: string[] = ['CAPA_No','CAPA_ID','Audit_Date','Date',
    'Due_Date', 'Initial_Followup','Classification','CAPA_Status'];

  entries = "";
  filterVal = "";
  currentId = "";
  currentFollowupId = "";
  currentEntry: any = [];
  supplierfilterVal = "";
  goHome() {
    this.router.navigate(['/']);
  }

  createId() {
      this.capaFollowup.forEach((item: any) => {
        item.id = this.dataService.createId();
      });
      this.capaFollowupList = new MatTableDataSource(this.capaFollowup); 
    }
  
  createCapaFollowupListUnique() {
    this.capaFollowup.forEach((item: any) => {
      if (!this.capaFollowupListUnique.find((element: any) => element.Supplier == item.Supplier)) {
        let entry = {
          id: item.id,
          Supplier: item.Supplier
        }
        this.capaFollowupListUnique.push(entry);
      }
    });
    this.entries = this.capaFollowupListUnique.length + " entries";
    this.capaFollowupUniqueList = new MatTableDataSource(this.capaFollowupListUnique); 
  }

  filterData() {
    this.capaFollowupUniqueList.filter = this.filterVal;
    this.capaFollowupUniqueList.filterPredicate = (data: any, searchText: string) => {
      return data.Supplier.toUpperCase().includes(searchText.toUpperCase());
    };
    this.entries = this.capaFollowupUniqueList.filteredData.length + " filtered entries";
  }

  setSelected(e: any) {
    this.currentId = e.id;
    this.supplierfilterVal = e.Supplier;
    this.currentEntry.Finding = "";
    this.currentEntry.CAPA_Response = "";
    this.currentEntry.CMO_Response = "";
    this.filterSupplier();
  }

  setSelectedFollowup(e: any) {
    this.currentFollowupId = e.id;
    let item = this.capaFollowup.find((element: any) => element.id == e.id);
    if (item) {
      this.currentEntry.Finding = item.Finding;
      this.currentEntry.CAPA_Response = item.CAPA_Response;
      this.currentEntry.CMO_Response = item.CMO_Response;
    }
  }

  filterSupplier() {
    this.capaFollowupList.filter = this.supplierfilterVal;
    this.capaFollowupList.filterPredicate = (data: any, searchText: string) => {
      return data.Supplier.includes(searchText);
    };
  }
}
