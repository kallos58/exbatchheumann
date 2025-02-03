import { DIALOG_DATA, DialogModule, DialogRef } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject, ChangeDetectionStrategy, Directive, ViewChild, ElementRef } from "@angular/core";
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from '../material.module';
import {default as _rollupMoment, Moment} from 'moment';
import * as _moment from 'moment';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import { MatDatepicker } from "@angular/material/datepicker";
import { MonthsYearsDialog } from './monthsYearsDialog.component'
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
  export class CdkDialog {
    @ViewChild('monthsYearsDialog', { static: true }) monthsYearsDialog!: ElementRef<HTMLDialogElement>;

    constructor() {}

    data = inject(DIALOG_DATA);
    eus = ["EU","Non-EU","Non-TPL","Non-EU-TPL"];
    
    status = ["F","S","U","(empty)"];
    dialogRef = inject(DialogRef);
    date = new FormControl(moment([2017, 0, 1]));

    manuDate = this.getCalendarDate(this.data.entry.Manufacturing_date);
    readonly dateManu = new FormControl(moment(this.manuDate));
    manuMonth = 0;
    manuYear = 0;
    dmonth = "";
    dyear = "";
    dmindex = 0;
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

    emitCancel() {
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

    addEvent(e: any, index: number) {
      let day = e.value._i.date < 10 ? ("0" +  e.value._i.date.toString()) : e.value._i.date.toString();
      let month = e.value._i.month + 1;
      month = month < 10 ? ("0" +  month.toString()) : month.toString();
      let year = e.value._i.year.toString();
      const date = day + "/" + month + "/" + year;
      if (index === 1) this.data.entry.Sample_Receipt_date = date;
      if (index === 2) this.data.entry.Release__Block_for_Marketing_date = date;
      if (index === 3) this.data.entry.Release__Block_for_Sale_date = date; 
    }

    getCalendarDate(d: string): string {
      const calendarDate = d.slice(3,7) + "/" + d.slice(0,2) + "/01";
      return calendarDate;
    }

    save() {
      this.dialogRef.close(this.data.entry);
    }
  
  }

 