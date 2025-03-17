import * as Cosmos from "@azure/cosmos";
import { CommonModule } from '@angular/common'
import { Component, ElementRef, OnInit, ViewChild, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Dialog, DialogModule, DialogRef} from '@angular/cdk/dialog';
import { CdkDialog } from './cdk-dialog';
import { MaterialModule } from '../material.module';
import { MessageboxDialog } from '../dialogs/messageboxDialog.component';
import { FilterOneColDialog } from '../dialogs/filterOneColDialog.component';
import { MatSort, Sort } from "@angular/material/sort";
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatTableDataSource } from "@angular/material/table";
import { MessageService } from '../services/messageService';
import { DataService } from '../services/dataService';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-batchrelease',
  imports: [   
    CommonModule,
    FormsModule, DialogModule, MaterialModule, MessageboxDialog, FilterOneColDialog, RouterOutlet],
  templateUrl: './batchrelease.component.html',
  styleUrl: './batchrelease.component.css'
})

export class BatchreleaseComponent implements OnInit {
  @ViewChild('messageboxDialog', { static: true }) messageboxDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('filterOneColDialog', { static: true }) filterOneColDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild(MatSort)

 

  sort: MatSort = new MatSort;
  entries = "";
  currentCol = "";
  currentIndex = 0;
  displayedColumns: string[] = ['SAP_Material_Number', 'FP_Batch_no__', 'Bulk_Batch_no_', 'MA_name_', 'Company'];
  dataSource = new MatTableDataSource();
  batchrelease: any = [];
  apimanufacturers: any = [];
  manufacturers: any = [];
  releasesites: any = [];
  categories: any = [];
  readonly dialog = inject(Dialog);
  DialogRef: DialogRef<CdkDialog> | undefined;
  currentItem: any = [];
  currentId: string = "";
  message = "The changes were saved...";
  messageIndex = 0;
  filterCol: string = "";
  filters: any = ["MA Name", "Chi Bame"];
  constructor(
    private messageService: MessageService,
    private dataService: DataService,
    private router: Router
  ) {}
  private _liveAnnouncer = inject(LiveAnnouncer);
  
  goHome() {
    this.router.navigate(['/']);
  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.dataService.batchrelase);
    this.apimanufacturers = this.dataService.apimanufacturers;
    this.manufacturers = this.dataService.manufacturers;
    this.releasesites = this.dataService.releasesites;
    this.categories = this.dataService.categories;
    this.entries = 'Batch Release: ' + this.dataService.batchrelase.length + " entries";
  }

  announceSortChange(sortState: Sort) {
    this.dataSource.sort = this.sort;
  }
 
  setSelected(e: any) {
    this.currentId = e.id;
  }

  openDialog(e: any) {
    this.currentId = e.id;
    const dialog = this.dialog.open(CdkDialog, {
      disableClose: true,
      width: '48em',
      data: {
        entry: e,
        currentEu: "EU",
        apimanufacturers: this.apimanufacturers,
        manufacturers: this.manufacturers,
        releasesites: this.releasesites,
        categories: this.categories
      },
    });
    
    dialog.closed.subscribe(async data => {
      if (!data) return;
      this.currentItem = data;
      this.messageboxDialog.nativeElement.showModal(); 
      setTimeout(() => {
        this.messageboxDialog.nativeElement.close();
      }, 2000);
      
      const endpoint = "https://schruefer.documents.azure.com:443/";
      const key = "ZE8r1ZNlJuL7o1F10F5NuPlJgJiC2TElldQycH2QCxIaZzkGcnxA5Za3URdElQM8ef66ctGmLNz1ACDbc9JuIA";
      const client = new Cosmos.CosmosClient({endpoint: endpoint, key: key});
      const database = "Heumann";
      const db = client.database(database);
      const container = db.container("Batch_Release");
      await container
        .item(this.currentItem.id, this.currentItem.id)
        .replace(this.currentItem);
    });
  }

  showFilterOneColDialog(currentCol: string, currentIndex: number) { 
    this.currentCol = "Filter by " + currentCol;
    this.currentIndex = currentIndex;
    this.filterOneColDialog.nativeElement.showModal();  
  }

  emitFilterOneCol(e: any) {
    this.filterOneColDialog.nativeElement.close();
    if (!e.filter) return;
    this.dataSource.filter = e.searchVal;
    this.dataSource.filterPredicate = (data: any, searchText: string) => {
      if (e.index === 1) return data.SAP_Material_Number.toString().toUpperCase().includes(searchText.toUpperCase());
      if (e.index === 2) return data.FP_Batch_no__.toString().toUpperCase().includes(searchText.toUpperCase());
      if (e.index === 3) return data.Bulk_Batch_no_.toString().toUpperCase().includes(searchText.toUpperCase());
      if (e.index === 4) return data.MA_name_.toString().toUpperCase().includes(searchText.toUpperCase());
    };
    this.entries = 'Batch Release: ' + this.dataSource.filteredData.length + " filtered entries";
    
  }
}

