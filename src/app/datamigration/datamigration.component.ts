import { Component } from '@angular/core';
import { MaterialModule } from '../material.module';
import { RouterOutlet, Router } from '@angular/router';
import {MatTreeModule} from '@angular/material/tree';
import { DataService } from '../services/dataService';
import { NgClass } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';  
interface CSVNode {
  name: string;
  index: number;
  children?: CSVNode[];
}

@Component({
  selector: 'app-datamigration',
  imports: [
    MaterialModule,
    MatTreeModule,
    RouterOutlet,
    NgClass,
    CommonModule
  ],
  templateUrl: './datamigration.component.html',
  styleUrl: './datamigration.component.css'
})

export class DatamigrationComponent {

  constructor(
    private router: Router,
    private dataService: DataService
  ) {}
  dataSource = CSV_DATA;
  tableDataSource: any = new MatTableDataSource();
  childrenAccessor = (node: CSVNode) => node.children ?? [];
  hasChild = (_: number, node: CSVNode) => !!node.children && node.children.length > 0;
  csvContent: any = []; 
  rows: string = "";
  treeIndex: number = 0;
  index: number = 1;
  csvTitle: string = "";
  data_for_csv: any = [];
  data_for_json: any = [];
  displayedColumns: string[] = ['id', 'content'];
  batchReleaseOverview: any = [];

  goHome() {
    this.router.navigate(['/']);
  }

  getDataCsv() {
    this.index = 1;
    this.data_for_json = [];
    this.data_for_csv = [];
    if (this.treeIndex === 1) {
      this.csvContent = "id;SAP_Mat_No;FP_Batch_No;Bulk_Batch_No;MA_Name;MA_No;Company_ID;Packsize;NTIN;Manufacturer_ID\r\n";
      this.csvContent += this.dataService.createId() + ";5500188;JAP012001;JAP2001;";
      this.csvContent += "Paracetamol HEUMANN 500 mg Tabletten bei Schmerzen und Fieber;3599.99.98;";
      this.csvContent += this.dataService.createId() + ";20;04150163520665;" + this.dataService.createId() + "\r\n";
      return;
    }
    this.batchReleaseOverview = this.dataService.batchReleaseOverview.default;
    if (this.treeIndex === 2 ) this.csvContent = "id;EU\r\n";
    if (this.treeIndex === 3 ) this.csvContent = "id;Company\r\n";
    if (this.treeIndex === 4 ) this.csvContent = "id;Manufacturer\r\n";
    if (this.treeIndex === 5 ) this.csvContent = "id;API_Manufacturer\r\n";
    if (this.treeIndex === 6 ) this.csvContent = "id;RB_Site\r\n";
    for (let i = 0; i < this.batchReleaseOverview.length; i++) {
      let data;
      if (this.treeIndex === 2 ) data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].EU);
      if (this.treeIndex === 3 ) data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].Company);
      if (this.treeIndex === 4 ) data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].Manufacturer);
      if (this.treeIndex === 5 ) data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].API_Manufacturer);
      if (this.treeIndex === 6 ) data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].RB_Site);
      if (!data) {
        let id = this.dataService.createId();
        let row;
        if (this.treeIndex === 2 ) row = id + ";" + this.batchReleaseOverview[i].EU;
        if (this.treeIndex === 3 ) row = id + ";" + this.batchReleaseOverview[i].Company;
        if (this.treeIndex === 4 ) row = id + ";" + this.batchReleaseOverview[i].Manufacturer;
        if (this.treeIndex === 5 ) row = id + ";" + this.batchReleaseOverview[i].API_Manufacturer;
        if (this.treeIndex === 6 ) row = id + ";" + this.batchReleaseOverview[i].RB_Site;
        this.csvContent += row + "\r\n";
        let content;
        if (this.treeIndex === 2 ) content = this.batchReleaseOverview[i].EU;
        if (this.treeIndex === 3 ) content = this.batchReleaseOverview[i].Company;
        if (this.treeIndex === 4 ) content = this.batchReleaseOverview[i].Manufacturer;
        if (this.treeIndex === 5 ) content = this.batchReleaseOverview[i].API_Manufacturer;
        if (this.treeIndex === 6 ) content = this.batchReleaseOverview[i].RB_Site;
        let entry = {
          id: id,
          content: content
        };
        this.data_for_json.push(entry);
        this.data_for_csv.push(content);
      }
    }
    this.tableDataSource = new MatTableDataSource(this.data_for_json);
  }

  setTreeIndex(node: CSVNode) {
    this.treeIndex = node.index;
    this.csvTitle = node.name;
  }

  displayTable() {
    this.index = 2;
  }

  exportAsXlsx() {
    this.dataService.exportAsExcelFile(this.data_for_json);
  }

  exportAsCsv() {
    this.dataService.exportToCSV(this.data_for_json);
  }

  getHeader() {
    if (this.treeIndex === 2) return "EU / Non-Eu";
    if (this.treeIndex === 3) return "Company";
    if (this.treeIndex === 4) return "Manufacturer";
    if (this.treeIndex === 5) return "API Manufacturer";
    if (this.treeIndex === 6) return "Release Blocking Site";
    return "";
  }
}

const CSV_DATA: CSVNode[] = [
  {
    name: 'Batch release overview Jan-to-Mar-2024.xlsx',
    children: [
      { index: 1, name: 'Article Master' },
      { index: 2, name: 'EU / Non-EU' },
      { index: 3, name: 'Companies' },
      { index: 4, name: 'Manufacturers' },
      { index: 5, name: 'API Manufacturers' },
      { index: 6, name: 'Release Blocking Sites' }
    ],
    index: 99
  }
];