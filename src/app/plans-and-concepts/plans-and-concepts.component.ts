import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as materialList from "../../assets/json/concept/List_of_SAP_FG_Material_Codes.json";
import * as batchReleaseOverview from "../../assets/json/concept/Batch_Relase_Overview_For_Concept.json";
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-plans-and-concepts',
 imports: [
    RouterOutlet,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './plans-and-concepts.component.html',
  styleUrl: './plans-and-concepts.component.css'
})
export class PlansAndConceptsComponent {

  constructor(
        private router: Router
  ) {
    this.materialList = materialList;
    this.batchReleaseOverview = batchReleaseOverview;
    this.createMaterialMaster();
  }

  materialList: any = [];
  batchReleaseOverview: any = [];
  materialMaster: any = [];
  materialMasterSoure: any = [];
  displayedColumnsMaterial: string[] = ['SAP_Mat_No', 'MA_Name_SAP', 'MA_Name_Batch'];
  goHome() {
    this.router.navigate(['/']);
  }

  createMaterialMaster() {
    let notFound = 0, found = 0;
    for ( let i = 0; i < this.materialList.default.length; i++) {
      if (!this.materialMaster.find((element: any) => element.Mat_No == this.materialList.default[i].Mat_No)) {
        let entry: any = {
          SAP_Mat_No: this.materialList.default[i].Mat_No,
          MA_Name_SAP: this.materialList.default[i].Material_description
        }
        let batchEntry = this.batchReleaseOverview.default.find((element: any) => element.SAP_Mat_No == this.materialList.default[i].Mat_No);
        if (batchEntry) {
          entry.hasBatches = true;
          entry.MA_Name_Batch = batchEntry.MA_Name;
          ++found;
        } else {
          entry.hasBatches = false;
          entry.MA_Name_Batch = "";
          ++notFound;
        }
        this.materialMaster.push(entry);
      }
    }
    this.materialMasterSoure = new MatTableDataSource(this.materialMaster);
    
  }

}
