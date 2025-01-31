import { DIALOG_DATA, DialogModule, DialogRef } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from '../material.module';
import {default as _rollupMoment, Moment} from 'moment';
import * as _moment from 'moment';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import { MatDatepicker, MatDatepickerInputEvent } from "@angular/material/datepicker";

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const MY_FORMATS2 = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
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
      CommonModule, FormsModule, DialogModule, MaterialModule, MatDatepicker, ReactiveFormsModule],
    providers: [
      // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
      // to your app config. We provide it at the component level here, due to limitations
      // of our example generation script.
      provideMomentDateAdapter(MY_FORMATS),
      provideMomentDateAdapter(MY_FORMATS2),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class CdkDialog {
    constructor() {}

    data = inject(DIALOG_DATA);
    eus = ["EU","Non-EU","Non-TPL","Non-EU-TPL"];
    status = ["F","S","U","(empty)"];
    dialogRef = inject(DialogRef);
    
    manuDate = this.getCalendarDate(this.data.entry.Manufacturing_date);
    readonly dateManu = new FormControl(moment(this.manuDate));
    manuMonth = 0;
    manuYear = 0;
    
    xDate = this.getCalendarDate(this.data.entry.Expiry_date);
    readonly dateX = new FormControl(moment(this.xDate));
    xMonth = 0;
    xYear = 0;

    startDate = "2025/01/11";
    readonly dateStart = new FormControl(new Date());

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
      const ctrlValue = this.dateManu.value ?? moment();
      ctrlValue.month(normalizedMonthAndYear.month());
      ctrlValue.year(normalizedMonthAndYear.year());
      this.dateManu.setValue(ctrlValue);
      this.manuMonth = normalizedMonthAndYear.month();
      this.manuYear = normalizedMonthAndYear.year();
      datepicker.close();
    }

    setMonthAndYearX(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
      const ctrlValue = this.dateX.value ?? moment();
      ctrlValue.month(normalizedMonthAndYear.month());
      ctrlValue.year(normalizedMonthAndYear.year());
      this.dateX.setValue(ctrlValue);
      this.xMonth = normalizedMonthAndYear.month();
      this.xYear = normalizedMonthAndYear.year();
      datepicker.close();
    }

    getCalendarDate(d: string): string {
      const calendarDate = d.slice(3,7) + "/" + d.slice(0,2) + "/01";
      return calendarDate;
    }

    save() {
      if (this.manuMonth != 0 && this.manuYear != 0) {
        this.manuMonth += 1;
        let date = (this.manuMonth < 10 ? "0" + this.manuMonth.toString() : this.manuMonth.toString()) + "/" + this.manuYear.toString();
        this.data.entry.Manufacturing_date = date;
      }
      if (this.xMonth != 0 && this.xYear != 0) {
        this.xMonth += 1;
        let date = (this.xMonth < 10 ? "0" + this.xMonth.toString() : this.xMonth.toString()) + "/" + this.xYear.toString();
        this.data.entry.Expiry_date = date;
      }
      this.dialogRef.close(this.data.entry);
    }
  
  }