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
  ) {
    this.euSource = new MatTableDataSource(this.dataService.eus);
  }
  dataSource = CSV_DATA;
  euSource: any = [];
  childrenAccessor = (node: CSVNode) => node.children ?? [];
  hasChild = (_: number, node: CSVNode) => !!node.children && node.children.length > 0;
  csvContent: any = []; 
  rows: string = "";
  eus: any = [];
  treeIndex: number = 0;
  index: number = 1;
  csvTitle: string = "";
  displayedColumnsEU: string[] = ['id', 'content'];
  goHome() {
    this.router.navigate(['/']);
  }

  getCsv() {
    this.index = 1;
    this.eus = this.dataService.eus;
    this.csvContent = "id;EU\r\n";
    for (let i = 0; i < this.eus.length; i++) {
      let row = this.eus[i].id + ";" + this.eus[i].content;
      this.csvContent += row + "\r\n";
    }
  }

  setTreeIndex(node: CSVNode) {
    this.treeIndex = node.index;
    this.csvTitle = node.name;
  }

  setIndex() {
    this.index = 2;
  }
}

const CSV_DATA: CSVNode[] = [
  {
    name: 'Batch release overview Jan-to-Mar-2024.xlsx',
    children: [
      { index: 1, name: 'Article Master' },
      { index: 2, name: 'EU / Non-EU' }
    ],
    index: 99
  }
];