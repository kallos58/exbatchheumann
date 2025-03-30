import { DIALOG_DATA, DialogModule, DialogRef } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject, ChangeDetectionStrategy, Directive, ViewChild, ElementRef, OnInit } from "@angular/core";
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from '../material.module';
import {default as _rollupMoment, Moment} from 'moment';
import * as _moment from 'moment';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import { MatDatepicker } from "@angular/material/datepicker";
import { MonthsYearsDialog } from './monthsYearsDialog.component'
import { DataService } from '../services/dataService';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
    selector: 'cdk-dialog',
    templateUrl: 'cdk-dialog.html',
    styleUrl: './cdk-dialog.css',
    imports: [
      CommonModule, FormsModule, DialogModule, MaterialModule, MatDatepicker, ReactiveFormsModule, MonthsYearsDialog],
    providers: [ provideMomentDateAdapter(MY_FORMATS) ],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class CdkDialog implements OnInit {
    @ViewChild('monthsYearsDialog', { static: true }) monthsYearsDialog!: ElementRef<HTMLDialogElement>;

    constructor(
      private dataService: DataService
    ) {
      this.isNotAllowedUser = this.dataService.isNotAllowedUser;
      this.abbreviations = this.dataService.abbreviations;
      console.log(this.abbreviations);
    }

    data = inject(DIALOG_DATA);
    
    isNotAllowedUser = false;
    status = ["F","S","U","(empty)"];
    batchstatus = ["printed","prechecked"];
    dialogRef = inject(DialogRef);
    date = new FormControl(moment([2017, 0, 1]));

    manuDate = this.getCalendarDate(this.data.entry.Manufacturing_date);
    readonly dateManu = new FormControl(moment(this.manuDate));
    manuMonth = 0;
    manuYear = 0;
    dmonth = "";
    dyear = "";
    dmindex = 0;
    eus: any = [];
    abbreviations: any = [];
    xMonth = this.data.entry.Expiry_date.slice(0,2);
    xYear = this.data.entry.Expiry_date.slice(3,7);
    xDate = this.getCalendarDate(this.data.entry.Expiry_date);
    readonly dateX = new FormControl(moment(this.xDate));
    
    srDate = this.data.entry.Sample_Receipt_date.slice(6,10) + "-" + 
      this.data.entry.Sample_Receipt_date.slice(3,5) + "-" + this.data.entry.Sample_Receipt_date.slice(0,2);
    readonly dateSr = new FormControl(new Date(this.srDate));

    bmDate = this.data.entry.Release__Block_for_Marketing_date.slice(6,10) + "-" + 
      this.data.entry.Release__Block_for_Marketing_date.slice(3,5) + "-" + 
      this.data.entry.Release__Block_for_Marketing_date.slice(0,2);
    readonly dateBm = new FormControl(new Date(this.bmDate));

    
    bsDate = this.data.entry.Release__Block_for_Sale_date.slice(6,10) + "-" + 
      this.data.entry.Release__Block_for_Sale_date.slice(3,5) + "-" + 
      this.data.entry.Release__Block_for_Sale_date.slice(0,2);
    readonly dateBs = new FormControl(new Date(this.bsDate));

    pmrDate = this.data.entry.Prio_meeting_release_date.slice(6,10) + "-" + 
      this.data.entry.Prio_meeting_release_date.slice(3,5) + "-" + 
      this.data.entry.Prio_meeting_release_date.slice(0,2);
    readonly datePmr = new FormControl(new Date(this.pmrDate));

    rqapmDate = this.data.entry.BRRor_QAPM.slice(6,10) + "-" + 
      this.data.entry.BRRor_QAPM.slice(3,5) + "-" + 
      this.data.entry.BRRor_QAPM.slice(0,2);
    readonly dateRqapm = new FormControl(new Date(this.rqapmDate));

    rcalcDate = this.data.entry.BRRor_calculation.slice(6,10) + "-" + 
      this.data.entry.BRRor_calculation.slice(3,5) + "-" + 
      this.data.entry.BRRor_calculation.slice(0,2);
    readonly dateRcalc = new FormControl(new Date(this.rcalcDate));

    qcalcDate = this.data.entry.QAPM_calculation.slice(6,10) + "-" + 
    this.data.entry.QAPM_calculation.slice(3,5) + "-" + 
    this.data.entry.QAPM_calculation.slice(0,2);
    readonly dateQcalc = new FormControl(new Date(this.qcalcDate));

    dbdDate = this.data.entry.date_batch_docs.slice(6,10) + "-" + 
    this.data.entry.date_batch_docs.slice(3,5) + "-" + 
    this.data.entry.date_batch_docs.slice(0,2);
    readonly dateDbd = new FormControl(new Date(this.dbdDate));
    
    coarecDate = this.data.entry.CoA_chem_received.slice(6,10) + "-" + 
    this.data.entry.CoA_chem_received.slice(3,5) + "-" + 
    this.data.entry.CoA_chem_received.slice(0,2);
    readonly dateCoarec = new FormControl(new Date(this.coarecDate));

    coaaddDate = this.data.entry.CoA_add_received.slice(6,10) + "-" + 
    this.data.entry.CoA_add_received.slice(3,5) + "-" + 
    this.data.entry.CoA_add_received.slice(0,2);
    readonly dateCoaadd = new FormControl(new Date(this.coaaddDate));

    cocrecDate = this.data.entry.CoC_received.slice(6,10) + "-" + 
    this.data.entry.CoC_received.slice(3,5) + "-" + 
    this.data.entry.CoC_received.slice(0,2);
    readonly dateCocrec = new FormControl(new Date(this.cocrecDate));

    ngOnInit(): void {
        this.eus = this.dataService.eus;
    }
    showMonthsYears(i: number) {
      this.dmindex = i;
      if (i === 1) {
        this.dmonth = this.data.entry.Manufacturing_date.slice(0,2);
        this.dyear = this.data.entry.Manufacturing_date.slice(3,7);
      } else {
        this.dmonth = this.data.entry.Expiry_date.slice(0,2);
        this.dyear = this.data.entry.Expiry_date.slice(3,7);
      }
      this.monthsYearsDialog.nativeElement.showModal(); ;
    }

    emitCancel(e: any) {
      this.monthsYearsDialog.nativeElement.close();
    }

    emitSave(e: any) {
      debugger;
      if ( e.i === 1) {
        this.data.entry.Manufacturing_date = e.m + "/" + e.y;
      } else {
        this.data.entry.Expiry_date = e.m + "/" + e.y;
      }
      this.monthsYearsDialog.nativeElement.close();
    }

    dateChangeEvent(e: any, index: number) {
      let day = e.value._i.date < 10 ? ("0" +  e.value._i.date.toString()) : e.value._i.date.toString();
      let month = e.value._i.month + 1;
      month = month < 10 ? ("0" +  month.toString()) : month.toString();
      let year = e.value._i.year.toString();
      const date = day + "/" + month + "/" + year;
      if (index === 1) this.data.entry.Sample_Receipt_date = date;
      if (index === 2) this.data.entry.Release__Block_for_Marketing_date = date;
      if (index === 3) this.data.entry.Release__Block_for_Sale_date = date; 
      if (index === 4) this.data.entry.Prio_meeting_release_date = date; 
      if (index === 5) this.data.entry.BRRor_QAPM = date; 
      if (index === 6) this.data.entry.BRRor_calculation = date;
      if (index === 7) this.data.entry.QAPM_calculation = date;
      if (index === 8) this.data.entry.date_batch_docs = date;
      if (index === 9) this.data.entry.CoA_chem_received = date;
      if (index === 10) this.data.entry.CoA_add_received = date;
      if (index === 11) this.data.entry.CoC_received = date;
    }

    changeChk(e: any, i: number) {
      if (i === 1) {
        this.data.entry.OGS_checked = e ? "x" : "";
      } else {
        this.data.entry.Temperaturauswertung_abgeschlossen = e ? "x" : "";
      }
    }

    getCalendarDate(d: string): string {
      const calendarDate = d.slice(3,7) + "/" + d.slice(0,2) + "/01";
      return calendarDate;
    }

    save() {
      debugger;
      this.dialogRef.close(this.data.entry);
    }
  
  }

 