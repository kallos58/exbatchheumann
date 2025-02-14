import * as Cosmos from "@azure/cosmos";
import { CommonModule } from '@angular/common'
import {signal , Component, ElementRef, OnInit, ViewChild, inject} from '@angular/core';
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

  //users = resource({
    ////loader: async () => {
   //   let endpoint = "https://schruefer.documents.azure.com:443/";
    //  let key = "ZE8r1ZNlJuL7o1F10F5NuPlJgJiC2TElldQycH2QCxIaZzkGcnxA5Za3URdElQM8ef66ctGmLNz1ACDbc9JuIA";
    //  let client = new Cosmos.CosmosClient({endpoint: this.endpoint, key: this.key});
    //  let database = "Heumann";
   //   let db = this.client.database(database);
   //   let container = db.container("Batch_Release");
  //  try {
  //    await container.items
  //    .query({
   //       query: "SELECT * from c"
   //   })
   //   .fetchAll()
   //   .then((response: any) => {
   //     console.log(response.resources);
   //     this.dataSource = new MatTableDataSource(response.resources);
   //   }) 
   /// } catch(error) {
  //    console.log(error);
 //   }    
 //   },
  //});

  sort: MatSort = new MatSort;
  entries = "";
  currentCol = "";
  currentIndex = 0;
  displayedColumns: string[] = ['SAP_Material_Number', 'FP_Batch_no__', 'Bulk_Batch_no_', 'MA_name_', 'Company'];
  dataSource = new MatTableDataSource();
  apiManufacturers: any = [];
  manufacturers: any = [];
  releasesites: any = [];
  categories: any = [];
  readonly dialog = inject(Dialog);
  DialogRef: DialogRef<CdkDialog> | undefined;
  currentItem: any = [];
  currentId: string = "";
  endpoint = "https://schruefer.documents.azure.com:443/";
  key = "ZE8r1ZNlJuL7o1F10F5NuPlJgJiC2TElldQycH2QCxIaZzkGcnxA5Za3URdElQM8ef66ctGmLNz1ACDbc9JuIA";
  client = new Cosmos.CosmosClient({endpoint: this.endpoint, key: this.key});
  database = "Heumann";
  db = this.client.database(this.database);

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

    //this.getBatchRelease();
    this.getAPIManufacturers();
    this.getManufacturers();
    this.getReleaseSites();
    this.getCategories();
    this.entries = 'Batch Release: ' + this.dataService.batchrelase.length + " entries";
  }

  announceSortChange(sortState: Sort) {
    this.dataSource.sort = this.sort;
  }

  async getBatchRelease() {
    const container = this.db.container("Batch_Release");
    try {
      await container.items
      .query({
          query: "SELECT * from c"
      })
      .fetchAll()
      .then((response: any) => {
        this.messageService.changeData('Batch Release: ' + response.resources.length + " entries");
        this.dataSource = new MatTableDataSource(response.resources);

      }) 
    } catch(error) {
      console.log(error);
    }    
  }

  async getAPIManufacturers() {
    const container = this.db.container("API_Manufacturers");
    try {
      await container.items
      .query({
          query: "SELECT * from c"
      })
      .fetchAll()
      .then((response: any) => {
        this.apiManufacturers = response.resources;
      }) 
    } catch(error) {
      console.log(error);
    }    
  }

  async getManufacturers() {
    const container = this.db.container("Manufacturers");
    try {
      await container.items
      .query({
          query: "SELECT * from c"
      })
      .fetchAll()
      .then((response: any) => {
        this.manufacturers = response.resources;
      }) 
    } catch(error) {
      console.log(error);
    }    
  }

  async getReleaseSites() {
    const container = this.db.container("Release_Sites");
    try {
      await container.items
      .query({
          query: "SELECT * from c"
      })
      .fetchAll()
      .then((response: any) => {
        this.releasesites = response.resources;
      }) 
    } catch(error) {
      console.log(error);
    }    
  }

  async getCategories() {
    const container = this.db.container("Categories");
    try {
      await container.items
      .query({
          query: "SELECT * from c"
      })
      .fetchAll()
      .then((response: any) => {
        this.categories = response.resources;
      }) 
    } catch(error) {
      console.log(error);
    }    
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
        apimanufacturers: this.apiManufacturers,
        manufacturers: this.manufacturers,
        releasesites: this.releasesites,
        categories: this.categories
      },
    });
    dialog.closed.subscribe(async data => {
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

