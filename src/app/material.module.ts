import { NgModule } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {Sort, MatSortModule} from '@angular/material/sort';

@NgModule({
  imports: [ 
    MatGridListModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepicker, 
    MatDatepickerModule,
    MatTabsModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSortModule
  ],
  exports: [
    MatGridListModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepicker, 
    MatDatepickerModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSortModule
  ]    
})

export class MaterialModule {}