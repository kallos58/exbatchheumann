import { Component, Directive, inject, model, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { DataService } from '../services/dataService';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
const moment = _rollupMoment || _moment;

export interface DialogData {
  animal: string;
  index: number;
}

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY'
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-master-by-sapno',
  imports: [
    RouterOutlet,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule
  ],
  providers: [
    // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideMomentDateAdapter(MY_FORMATS),
  ],
  templateUrl: './master-by-sapno.component.html',
  styleUrl: './master-by-sapno.component.css'
})

export class MasterBySapnoComponent implements OnInit {
 constructor(
      private router: Router,
      private dataService: DataService
  ) {
    this.masterCaption = "Article Master (" + String(this.dataService.concept_master_sapno.length) + ")";
    this.articleMaster = this.dataService.concept_master_sapno;
    this.companies = this.dataService.concept_companies;
    this.batches = new MatTableDataSource(this.dataService.concept_batches);
    this.rbsites = this.dataService.concept_rbsites;
    this.rbsites.sort(function(a: { RB_Site: string; }, b: { RB_Site: string; }) {
      return a.RB_Site.localeCompare(b.RB_Site)
    });  
    this.status = this.dataService.concept_status;
    this.responsibles = this.dataService.concept_responsibles;   
    this.priorities = this.dataService.concept_priorities;  
    this.statusbatchdocs = this.dataService.concept_statusbatchdocs; 
  }
  
  masterCaption: string = "";
  currentMasterId: string = "";
  batchesFilter: string = "";
  companies: any = [];
  articleMaster: any = [];
  currentEntry: any = [];
  currentBatchEntry: any = [];
  batchCopy: any = [];
  batches: any = [];
  rbsites: any = [];
  status: any = [];
  statusbatchdocs: any = [];
  responsibles: any = [];
  priorities: any = [];
  filterVal: string = "";
  displayedColumnsBatch: string[] = ['FP_Batch_No','RB_Site','Status_Shortcut','Manufacturing_Date','Expiry_Date','Sample_Receipt_Date'];
  show: boolean = true;
  months = [1,2,3,4,5,6,7,8,9,10,11,12];
  dmonth = 1;
  manudate = new FormControl(moment(new Date("2025-01-01")));
  expirydate = new FormControl(moment(new Date("2025-01-01")));
  srdate: string = "";
  rbmdate: string = "";
  rbsdate: string = "";
  pmdate: string = "";
  brrqapmdate: string = "";
  brrcalcdate: string = "";
  qapmcalcdate: string = "";
  dbdate: string = "";
  coarecdate: string = "";
  coaadddate: string = "";
  baseindex: number = 0;
  settings = ["- Select base table -", "Status", "Release Blocking Sites"];
  readonly animal = signal('');
  readonly index = model('');
  readonly dialog = inject(MatDialog);  
  setting: string = "- Select base table -";

  ngOnInit(): void {
      this.selectMaterial(this.dataService.concept_master_sapno[0].SAP_Mat_No);
  }

  openDialog(index: number): void {
    this.baseindex = index;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {index: index, animal: this.animal()},
    });

    dialogRef.afterClosed().subscribe(result => {
      let entry;
      if (result !== undefined) {
        for (let i = 0; i < result.length; i++) {
          if (this.baseindex === 1) {
            entry = this.status.find((e: { id: any;  }) => e.id === result[0].id);
            if (entry) entry = result[0];
            else (this.status.push(result[0]));
          } else {
            entry = this.rbsites.find((e: { id: any;  }) => e.id === result[0].id);
            if (entry) entry = result[0];
            else (this.rbsites.push(result[0]));
          }
        }
      }
    });
  }
  
  onChangeSelect() {
    if (this.setting === "Status") this.openDialog(1);
    if (this.setting === "Release Blocking Sites") this.openDialog(2);
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, index: number) {
    let ctrlValue;
    if (index === 1) {
      ctrlValue = this.manudate.value ?? moment();
      ctrlValue.month(normalizedMonthAndYear.month());
      ctrlValue.year(normalizedMonthAndYear.year());
      this.manudate.setValue(ctrlValue);
      if (this.manudate.value) {
        this.currentBatchEntry.Manufacturing_Date = String(this.manudate.value?.month() + 1) + "/" + String(this.manudate.value?.year());
      }
    }
    if (index === 2) {
      ctrlValue = this.expirydate.value ?? moment();
      ctrlValue.month(normalizedMonthAndYear.month());
      ctrlValue.year(normalizedMonthAndYear.year());
      this.expirydate.setValue(ctrlValue);
      if (this.expirydate.value) {
        this.currentBatchEntry.Expiry_Date = String(this.expirydate.value?.month() + 1) + "/" + String(this.expirydate.value?.year());
      }
    }
    datepicker.close();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  selectMaterial(id: string) {
    this.show = true;
    this.currentMasterId = id;
    this.currentEntry = this.dataService.concept_master_sapno.find((e: { SAP_Mat_No: string; id: any;  }) => e.SAP_Mat_No === id);
    this.filterBatches(id);
  }

  filterBatches(id: string) {
    this.batches.filter = id;
    this.batches.filterPredicate = (data: any, searchText: string) => {
      return data.SAP_Mat_No.toString().includes(searchText) ;
    };
    if (this.batches.filteredData.length === 1) this.batchesFilter = this.batches.filteredData.length + " batch for " + id;
    else this.batchesFilter = this.batches.filteredData.length + " batches for " + id;
  }

  showEditBatchDialog(e: any) {
    let manudate = e.Manufacturing_Date;
    manudate = manudate.slice(3,7) + "-" + manudate.slice(0,2) + "-01";
    this.manudate = new FormControl(moment(new Date(manudate)));
    let expirydate = e.Expiry_Date;
    expirydate = expirydate.slice(3,7) + "-" + expirydate.slice(0,2) + "-01";
    this.expirydate = new FormControl(moment(new Date(expirydate)));
    this.show = false;
    this.srdate = e.Sample_Receipt_Date;
    this.srdate = "20" + this.srdate.slice(6,8) + "-" + this.srdate.slice(3,5) + "-" + this.srdate.slice(0,2);
    this.rbmdate = e.RB_Marketing_Date;
    this.rbmdate = "20" + this.rbmdate.slice(6,8) + "-" + this.rbmdate.slice(3,5) + "-" + this.rbmdate.slice(0,2);
    this.rbsdate = e.RB_Sale_Date;
    this.rbsdate = "20" + this.rbsdate.slice(6,8) + "-" + this.rbsdate.slice(3,5) + "-" + this.rbsdate.slice(0,2);
    this.pmdate = e.PrioMeeting;
    this.pmdate = "20" + this.pmdate.slice(6,8) + "-" + this.pmdate.slice(3,5) + "-" + this.pmdate.slice(0,2);
    this.brrqapmdate = e.BRRor_QAPM_Date;
    this.brrqapmdate = "20" + this.brrqapmdate.slice(6,8) + "-" + this.brrqapmdate.slice(3,5) + "-" + this.brrqapmdate.slice(0,2);
    this.brrcalcdate = e.BRRor_Calc_Date;
    this.brrcalcdate = "20" + this.brrcalcdate.slice(6,8) + "-" + this.brrcalcdate.slice(3,5) + "-" + this.brrcalcdate.slice(0,2);
    this.qapmcalcdate = e.QAPM_Calc_Date;
    this.qapmcalcdate = "20" + this.qapmcalcdate.slice(6,8) + "-" + this.qapmcalcdate.slice(3,5) + "-" + this.qapmcalcdate.slice(0,2);
    this.dbdate = e.Batch_Docs_Date;
    this.dbdate = "20" + this.dbdate.slice(6,8) + "-" + this.dbdate.slice(3,5) + "-" + this.dbdate.slice(0,2);
    this.coarecdate = e.CoA_Chem_Rec;
    this.coarecdate = "20" + this.coarecdate.slice(6,8) + "-" + this.coarecdate.slice(3,5) + "-" + this.coarecdate.slice(0,2);
    this.coaadddate = e.CoA_Add_Rec;
    this.coaadddate = "20" + this.coaadddate.slice(6,8) + "-" + this.coaadddate.slice(3,5) + "-" + this.coaadddate.slice(0,2);
    this.currentBatchEntry = e;
    this.batchCopy = structuredClone(this.currentBatchEntry);
  }

  filterMaster() {
    let infilter = 0;
    for (let i = 0; i < this.dataService.concept_master_sapno.length; i++) 
      if (this.dataService.concept_master_sapno[i].SAP_Mat_No.includes(this.filterVal)) {
        this.dataService.concept_master_sapno[i].filter = false;
        ++infilter;
      }
      else if (this.dataService.concept_master_sapno[i].MA_Name.toUpperCase().includes(this.filterVal.toUpperCase())) {
        this.dataService.concept_master_sapno[i].filter = false;
        ++infilter;
      }
      else if (this.dataService.concept_master_sapno[i].MA_No.toUpperCase().includes(this.filterVal.toUpperCase())) {
        this.dataService.concept_master_sapno[i].filter = false;
        ++infilter;
      }
      else { this.dataService.concept_master_sapno[i].filter = true;
    }
    this.masterCaption = "Article Master (" + infilter + " filtered)";
    this.filterBatches("dummy");
    this.batchesFilter = "";
  }

  unfilterMaster() {
    for (let i = 0; i < this.dataService.concept_master_sapno.length; i++) {
      this.dataService.concept_master_sapno[i].filter = false;
    }
    this.masterCaption = "Article Master (" + String(this.dataService.concept_master_sapno.length) + ")";
  }

  saveBatch() {
    let entry = this.batches._data._value.find((e: { id: string }) => e.id === this.currentBatchEntry.id);
    entry = this.currentBatchEntry;
    this.show = true;
  }

  cancelBatch() {
    
    Object.keys(this.currentBatchEntry).forEach((key) => {
      this.currentBatchEntry[key] = this.batchCopy[key];
    });
    this.show = true;
  }

  changeDate(e: any, index: number) {
    if (index === 1)
      this.currentBatchEntry.Sample_Receipt_Date = e.target.value.slice(8,10) + "." + 
        e.target.value.slice(5,7) + "." + e.target.value.slice(0,4);
    if (index === 2)
      this.currentBatchEntry.RB_Marketing_Date = e.target.value.slice(8,10) + "." + 
        e.target.value.slice(5,7) + "." + e.target.value.slice(0,4);
    if (index === 3)
      this.currentBatchEntry.Sample_Sale_Date = e.target.value.slice(8,10) + "." + 
        e.target.value.slice(5,7) + "." + e.target.value.slice(0,4);
        e.target.value.slice(5,7) + "." + e.target.value.slice(0,4);
    if (index === 4)
      this.currentBatchEntry.PrioMeeting = e.target.value.slice(8,10) + "." + 
        e.target.value.slice(5,7) + "." + e.target.value.slice(0,4);
    if (index === 5)
      this.currentBatchEntry.BRRor_QAPM_Date = e.target.value.slice(8,10) + "." + 
        e.target.value.slice(5,7) + "." + e.target.value.slice(0,4);
    if (index === 6)
      this.currentBatchEntry.BRRor_Calc_Date = e.target.value.slice(8,10) + "." + 
        e.target.value.slice(5,7) + "." + e.target.value.slice(0,4);
    if (index === 7)
      this.currentBatchEntry.QAPM_Calc_Date = e.target.value.slice(8,10) + "." + 
        e.target.value.slice(5,7) + "." + e.target.value.slice(0,4);
    if (index === 8)
      this.currentBatchEntry.Batch_Docs_Date = e.target.value.slice(8,10) + "." + 
        e.target.value.slice(5,7) + "." + e.target.value.slice(0,4);
    if (index === 9)
      this.currentBatchEntry.CoA_Chem_Rec = e.target.value.slice(8,10) + "." + 
        e.target.value.slice(5,7) + "." + e.target.value.slice(0,4);
  }

  changeSelect(e: any, index: number) {
    if (index === 1) {
      let status = this.status.find((s: { id: string }) => s.id === e);
      this.currentBatchEntry.Status_Id = status.id;
      this.currentBatchEntry.Status_Shortcut = status.shortcut;
    }
    if (index === 2) this.currentBatchEntry.BRRor_Resp_Id = e;
    if (index === 3) this.currentBatchEntry.QAPM_Resp_Id = e;
    if (index === 4) this.currentBatchEntry.QP_Resp_Id = e;
    if (index === 5) this.currentBatchEntry.Priority_Id = e;
  }

  changeChk(e: any, index: number) {
    if (index === 1) {
      if (e.target.value === "on") {
        this.currentBatchEntry.PrioMeeting = "Not Applicable";
        this.pmdate = "";
      } else {
        this.currentBatchEntry.PrioMeeting = "";
        this.pmdate = "";
      }
    }
    if (index === 2) {
      if (e.target.value === "on") {
        this.currentBatchEntry.OGS_checked = "x";
      } else {
        this.currentBatchEntry.OGS_checked = "";
      }
    }
    if (index === 3) {
      if (e.target.value === "on") {
        this.currentBatchEntry.Temp_Eval_Completed = "x";
      } else {
        this.currentBatchEntry.Temp_Eval_Completed = "";
      }
    }
    if (index === 4) {
      if (e.target.value === "on") {
        this.currentBatchEntry.CoA_Chem_Rec = "n/a";
        this.coarecdate = "";
      } else {
        this.currentBatchEntry.CoA_Chem_Rec = "";
      }
    }
    if (index === 5) {
      if (e.target.value === "on") {
        this.currentBatchEntry.CoA_Add_Rec = "n/a";
        this.coaadddate = "";
      } else {
        this.currentBatchEntry.CoA_Add_Rec = "";
      }
    }
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrl: 'dialog-overview-example-dialog.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MaterialModule,
    CommonModule
  ],
})
export class DialogOverviewExampleDialog {
  constructor(
    private dataService: DataService
) {  
  this.settingsstatus =  new MatTableDataSource(this.dataService.concept_status);
  this.settingsrbsites =  new MatTableDataSource(this.dataService.concept_rbsites);
}
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  displayedColumnsStatus: string[] = ['shortcut','status'];
  displayedColumnsRbsites: string[] = ['rbsite'];
  settingsstatus: any = [];
  settingsrbsites: any = [];
  disabled: boolean = true;
  value1: string = "";
  value2: string = "";
  currentEntry: any = [];
  result: any = [];
  mode: number = 0;

  onClose(): void {
    this.dialogRef.close(this.result);
  }

  showSetting(e: any) {
    this.currentEntry = e;
    if (this.data.index === 1) {
      this.value1 = e.shortcut;
      this.value2 = e.status;
    } else {
      this.value2 = e.RB_Site;
      this.value1 = "";
    }
  }

  saveData() {
    if (this.data.index === 1) this.saveStatus();
    if (this.data.index === 2) this.saveRbsite();
  }

  saveStatus() {
    let data =this.settingsstatus.data;
    let entry = {
      id: this.mode === 1 ? this.currentEntry.id : this.dataService.createId(),
      shortcut: this.value1,
      status: this.value2
    };
    if (this.mode === 1) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === entry.id) {
          data[i] = entry;
        }
      }
    } else {
      data.push(entry);
    }
    this.settingsstatus.data = data;
    this.result.push(entry, this.data.index);
  }

  saveRbsite() {

    let data =this.settingsrbsites.data;
    let entry = {
      id: this.mode === 1 ? this.currentEntry.id : this.dataService.createId(),
      RB_Site: this.value2
    };
    if (this.mode === 1) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === entry.id) {
          data[i] = entry;
        }
      }
    } else {
      data.push(entry);
    }
    this.settingsrbsites.data = data;
    this.result.push(entry, this.data.index);
  }

  setDisabled() {
    this.mode = 1;
    if (this.disabled) this.disabled = false;
  }

  addData() {
    this.mode = 2;
    this.disabled = false;
    this.value1 = "(new)";
    this.value2 = "(new)";
  }
}