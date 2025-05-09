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
    this.batchReleaseOverview = this.dataService.batchReleaseOverview.default;
    this.manufacturers = this.dataService.manufacturersExtedo.default;
    this.responsibles = this.dataService.responsibles.default;
    this.priorities = this.dataService.priorities.default;
    this.materialMasterDataSource = new MatTableDataSource(this.dataService.concept_master);
    this.materialMasterDataSourceSAPNo = new MatTableDataSource(this.dataService.concept_master_sapno);
    debugger;
    this.batchesDataSource = new MatTableDataSource(this.dataService.concept_batches);
  }
  dataSource = CSV_DATA;
  tableDataSource: any = new MatTableDataSource();
  materialMasterDataSource: any = new MatTableDataSource();
  materialMasterDataSourceSAPNo: any = new MatTableDataSource();
  batchesDataSource: any = new MatTableDataSource();

  childrenAccessor = (node: CSVNode) => node.children ?? [];
  hasChild = (_: number, node: CSVNode) => !!node.children && node.children.length > 0;
  csvContent: any = []; 
  rows: string = "";
  treeIndex: number = 0;
  index: number = 1;
  csvTitle: string = "";
  data_for_csv: any = [];
  data_for_json: any = [];
  data_for_xls: any = [];
  displayedColumns: string[] = ['id', 'content', 'content2'];
  displayedColumnsMaterial: string[] = ['MA_No', 'MA_Name', 'SAP_Mat_No','Company','Packsize','NTIN','API_Manufacturer','Manufacturer','EU'];
  displayedColumnsMaterialSAPNo: string[] = ['SAP_Mat_No', 'MA_Name', 'Packsize', 'Company', 'MA_No'];
  displayedColumnsBatches: string[] = ['SAP_Mat_No', 'FP_Batch_No', 'Bulk_Batch_No','Manufacturing_Date','Expiry_Date','RB_Site'];

  batchReleaseOverview: any = [];
  manufacturers: any = [];
  responsibles: any = [];
  priorities: any = []; 
  goHome() {
    this.router.navigate(['/']);
  }

  
  getDataCsv() {
    this.index = 1;
    this.data_for_json = [];
    this.data_for_csv = [];
    if (this.treeIndex === 9) {
      this.getDataMaterialmaster();
      return;
    }

    if (this.treeIndex === 18) {
      this.getDataMaterialmasterBySAPNo();
      return;
    }
   
    if (this.treeIndex === 17) {
      this.getDataBatches();
      return;
    }

    if (this.treeIndex === 15) {
      this.getDataCsvResponsibles();
      return;
    }
    if (this.treeIndex === 16) {
      this.getDataCsvPriorities();
      return;
    }
    if (this.treeIndex === 19) {
      this.getDataCsvStatus();
      return;
    }
    if (this.treeIndex === 3 || this.treeIndex === 11) {
      this.getCompaniesCsv();
      return;
    }
    if (this.treeIndex === 12) {
      this.getEusCsv();
      return;
    }
    if (this.treeIndex === 13) {
      this.getRbsitesCsv();
      return;
    }
    if (this.treeIndex === 14) {
      this.getCategoriesCsv();
      return;
    }
    if (this.treeIndex === 10) {
      this.getManufacturersCsv();
      return;
    }

    if (this.treeIndex === 1) {
      this.csvContent = "id;SAP_Mat_No;FP_Batch_No;Bulk_Batch_No;MA_Name;MA_No;Company_ID;Packsize;NTIN;Manufacturer_ID\r\n";
      this.csvContent += this.dataService.createId() + ";5500188;JAP012001;JAP2001;";
      this.csvContent += "Paracetamol HEUMANN 500 mg Tabletten bei Schmerzen und Fieber;3599.99.98;";
      this.csvContent += this.dataService.createId() + ";20;04150163520665;" + this.dataService.createId() + "\r\n";
      return;
    }
    let to = 1;
    
    if (this.treeIndex === 2 || this.treeIndex === 12) this.csvContent = "id;EU\r\n";
    if (this.treeIndex === 3 || this.treeIndex === 11 ) this.csvContent = "id;Company\r\n";
    if (this.treeIndex === 4 ) this.csvContent = "id;Manufacturer\r\n";
    if (this.treeIndex === 5 ) this.csvContent = "id;API_Manufacturer\r\n";
    if (this.treeIndex === 14 ) this.csvContent = "id;Category\r\n";
    if (this.treeIndex === 6 || this.treeIndex === 13) this.csvContent = "id;RB_Site\r\n";
    if (this.treeIndex === 8 ) {
      return;
    }
    if (this.treeIndex === 10 ) {
      this.csvContent = "id;Manufacturer\r\n";
      to = 2;
    }
    if (this.treeIndex === 11 ) this.csvContent = "id;Company\r\n";
    for (let j = 1; j <= to; j++) {
      for (let i = 0; i < this.batchReleaseOverview.length; i++) {
        let data;
        if (this.treeIndex === 2 ) data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].EU);
        if (this.treeIndex === 3 ) data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].Company);
        if (this.treeIndex === 4 ) data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].Manufacturer);
        if (this.treeIndex === 5 ) data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].API_Manufacturer);
        if (this.treeIndex === 6 || this.treeIndex === 13) data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].RB_Site);
        if (this.treeIndex === 11 ) data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].Company);
        if (this.treeIndex === 12 ) data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].EU);
        if (this.treeIndex === 14 && this.batchReleaseOverview[i].Category !== "") data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].Category);
        if (this.treeIndex === 10 ) {
          if (j === 1) data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].Manufacturer);
          else data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].API_Manufacturer);
        }
        if (!data) {
          let id = this.dataService.createId();
          let row;
          if (this.treeIndex === 2 || this.treeIndex === 12) row = id + ";" + this.batchReleaseOverview[i].EU;
          if (this.treeIndex === 3 || this.treeIndex === 11) row = id + ";" + this.batchReleaseOverview[i].Company;
          if (this.treeIndex === 4 ) row = id + ";" + this.batchReleaseOverview[i].Manufacturer;
          if (this.treeIndex === 5 ) row = id + ";" + this.batchReleaseOverview[i].API_Manufacturer;
          if (this.treeIndex === 6 || this.treeIndex === 13) row = id + ";" + this.batchReleaseOverview[i].RB_Site;
          if (this.treeIndex === 14  && this.batchReleaseOverview[i].Category !== "") row = id + ";" + this.batchReleaseOverview[i].Category;
          if (this.treeIndex === 10 ) {
            if (j === 1) row = id + ";" + this.batchReleaseOverview[i].Manufacturer;
            else row = id + ";" + this.batchReleaseOverview[i].API_Manufacturer;
          }
          if (row) this.csvContent += row + "\r\n";
          let content;
          if (this.treeIndex === 2 || this.treeIndex === 12) content = this.batchReleaseOverview[i].EU;
          if (this.treeIndex === 3 || this.treeIndex === 11) content = this.batchReleaseOverview[i].Company;
          if (this.treeIndex === 4 ) content = this.batchReleaseOverview[i].Manufacturer;
          if (this.treeIndex === 5 ) content = this.batchReleaseOverview[i].API_Manufacturer;
          if (this.treeIndex === 6 || this.treeIndex === 13) content = this.batchReleaseOverview[i].RB_Site;
          if (this.treeIndex === 14  && this.batchReleaseOverview[i].Category !== "") content = this.batchReleaseOverview[i].Category;
          if (this.treeIndex === 10 ) {
            if (j === 1) content = this.batchReleaseOverview[i].Manufacturer;
            else content = this.batchReleaseOverview[i].API_Manufacturer;
          }
          let entry = {
            id: id,
            content: content,
            content2: ""
          };
          if (entry.content) this.data_for_json.push(entry);
          if (content && content !== undefined) this.data_for_csv.push(content);
        }
        
      }
      this.data_for_json = this.data_for_json.sort((a: { content: string; }, b: { content: string; }) => {
        if (a.content < b.content) {
          return -1;
        }
        if (a.content > b.content) {
          return 1;
        }
        return 0;
      });
    }
   debugger;
    this.tableDataSource = new MatTableDataSource(this.data_for_json);
  }

  getDataCsvMaster() {
    this.index = 1;
    this.data_for_json = [];
    this.data_for_csv = [];
    this.batchReleaseOverview = this.dataService.batchReleaseOverview.default;
    this.csvContent = "id;SAPMatNo\r\n";
    debugger;
    for (let i = 0; i < this.batchReleaseOverview.length; i++) {
      let data = this.data_for_csv.find((element: string) => element == this.batchReleaseOverview[i].SAP_Mat_No);
      if (!data) {
        let id = this.dataService.createId();
        let row = id + ";" + this.batchReleaseOverview[i].SAP_Mat_No;
        this.csvContent += row + "\r\n";
        let entry = {
          id: id,
          SAPMatNo: this.batchReleaseOverview[i].SAP_Mat_No
        };
        this.data_for_json.push(entry);
        this.data_for_csv.push(this.batchReleaseOverview[i].SAP_Mat_No);
    }
      this.data_for_json = this.data_for_json.sort((a: { SAPMatNo: string; }, b: { SAPMatNo: string; }) => {
        if (a.SAPMatNo < b.SAPMatNo) {
          return -1;
        }
        if (a.SAPMatNo > b.SAPMatNo) {
          return 1;
        }
        return 0;
      });
    }
    this.materialMasterDataSource = new MatTableDataSource(this.data_for_json);
  }

  getManufacturersCsv() {
    this.data_for_xls = [];
    this.csvContent = "id;Manufacturer\r\n";
    for ( let i = 0; i < this.dataService.concept_manufacturers.length; i++) {
      this.csvContent  += this.dataService.concept_manufacturers[i].id + ";" + this.dataService.concept_manufacturers[i].Manufacturer + "\r\n";
      let entry = {
        id:  this.dataService.concept_manufacturers[i].id,
        content: this.dataService.concept_manufacturers[i].Manufacturer,
        content2: ""
      };
      this.data_for_json.push(entry);
      let xlsentry = {
        Manufacturer_Id:  this.dataService.concept_manufacturers[i].id,
        Manufacturer: this.dataService.concept_manufacturers[i].Manufacturer
      };
      this.data_for_xls.push(xlsentry);
    }
    this.data_for_json = this.data_for_json.sort((a: { content: string; }, b: { content: string; }) => {
      if (a.content < b.content) {
        return -1;
      }
      if (a.content > b.content) {
        return 1;
      }
      return 0;
    });
    this.tableDataSource = new MatTableDataSource(this.data_for_json);
  }

  getCompaniesCsv() {
    this.data_for_xls = [];
    this.csvContent = "id;Company\r\n";
    debugger;
    for ( let i = 0; i < this.dataService.concept_companies.length; i++) {
      this.csvContent  += this.dataService.concept_companies[i].id + ";" + this.dataService.concept_companies[i].Company + "\r\n";
      let entry = {
        id:  this.dataService.concept_companies[i].id,
        content: this.dataService.concept_companies[i].Company,
        content2: ""
      };
      this.data_for_json.push(entry);
      let xlsentry = {
        Company_Id:  this.dataService.concept_companies[i].id,
        Company: this.dataService.concept_companies[i].Company
      };
      this.data_for_xls.push(xlsentry);
    }
    this.tableDataSource = new MatTableDataSource(this.data_for_json);
  }

  getEusCsv() {
    this.csvContent = "id;EU\r\n";
    this.data_for_xls = [];
    for ( let i = 0; i < this.dataService.concept_eus.length; i++) {
      this.csvContent  += this.dataService.concept_eus[i].id + ";" + this.dataService.concept_eus[i].EU + "\r\n";
      let entry = {
        id:  this.dataService.concept_eus[i].id,
        content: this.dataService.concept_eus[i].EU,
        content2: ""
      };
      this.data_for_json.push(entry);
      let xlsentry = {
        EU_Id:  this.dataService.concept_eus[i].id,
        EU: this.dataService.concept_eus[i].EU
      };
      this.data_for_xls.push(xlsentry);
    }
    this.tableDataSource = new MatTableDataSource(this.data_for_json);
  }

  getRbsitesCsv() {
    this.csvContent = "id;Release_Blocking_Site\r\n";
    this.data_for_xls = [];
    for ( let i = 0; i < this.dataService.concept_rbsites.length; i++) {
      this.csvContent  += this.dataService.concept_rbsites[i].id + ";" + this.dataService.concept_rbsites[i].RB_Site + "\r\n";
      let entry = {
        id:  this.dataService.concept_rbsites[i].id,
        content: this.dataService.concept_rbsites[i].RB_Site,
        content2: ""
      };
      this.data_for_json.push(entry);
      let xlsentry = {
        RB_Site_Id:  this.dataService.concept_rbsites[i].id,
        RB_Site: this.dataService.concept_rbsites[i].RB_Site
      };
      this.data_for_xls.push(xlsentry);
    }
    this.data_for_json = this.data_for_json.sort((a: { content: string; }, b: { content: string; }) => {
      if (a.content < b.content) {
        return -1;
      }
      if (a.content > b.content) {
        return 1;
      }
      return 0;
    });

    this.tableDataSource = new MatTableDataSource(this.data_for_json);
  }

  getDataMaterialmaster() {
    this.csvContent = "id;MA_No;MA_Name;SAP_Mat_No;Company;Packsize;NTIN;API_Manufacturer;Manufacturer;EU\r\n";
    this.data_for_xls = [];
    for ( let i = 0; i < this.dataService.concept_master.length; i++) {
      this.csvContent  += this.dataService.concept_master[i].id + ";" + this.dataService.concept_master[i].MA_No + ";" +
        this.dataService.concept_master[i].MA_Name + ";" + this.dataService.concept_master[i].SAP_Mat_No + ";" + 
          this.dataService.concept_master[i].Company.Company + ";" + this.dataService.concept_master[i].Packsize + ";" +
           this.dataService.concept_master[i].NTIN + ";" + this.dataService.concept_master[i].API_Manufacturer.Manufacturer +
           ";" + this.dataService.concept_master[i].Manufacturer.Manufacturer + ";" + 
           this.dataService.concept_master[i].EU.EU + "\r\n";
      let entry = {
        id:  this.dataService.concept_master[i].id,
        MA_No: String(this.dataService.concept_master[i].MA_No),
        MA_Name: this.dataService.concept_master[i].MA_Name,
        SAP_Mat_No: String(this.dataService.concept_master[i].SAP_Mat_No),
        Company: this.dataService.concept_master[i].Company.Company,
        Company_Id: this.dataService.concept_master[i].Company.id,
        Packsize: this.dataService.concept_master[i].Packsize,
        NTIN: this.dataService.concept_master[i].NTIN,
        API_Manufacturer: this.dataService.concept_master[i].API_Manufacturer.Manufacturer,
        API_Manufacturer_Id: this.dataService.concept_master[i].API_Manufacturer.id,
        Manufacturer: this.dataService.concept_master[i].Manufacturer.Manufacturer,
        Manufacturer_Id: this.dataService.concept_master[i].Manufacturer.id,
        EU: this.dataService.concept_master[i].EU.EU,
        EU_Id: this.dataService.concept_master[i].EU.id
      };
      this.data_for_json.push(entry); 
      this.data_for_xls.push(entry); 
    }
  }

  getDataMaterialmasterBySAPNo() {
    this.csvContent = "id;SAP_Mat_No;MA_Name;Packsize;Company;MA_No\r\n";
    this.data_for_xls = [];
    debugger;
    for ( let i = 0; i < this.dataService.concept_master_sapno.length; i++) {
      this.csvContent  += this.dataService.concept_master_sapno[i].id + ";" + this.dataService.concept_master_sapno[i].SAP_Mat_No + ";" +
        this.dataService.concept_master_sapno[i].MA_Name + ";" + this.dataService.concept_master_sapno[i].Packsize + ";" + 
          this.dataService.concept_master_sapno[i].Company.Company + ";" + this.dataService.concept_master_sapno[i].MA_No + "\r\n";
      let entry = {
        id:  this.dataService.concept_master_sapno[i].id,
        SAP_Mat_No: String(this.dataService.concept_master_sapno[i].SAP_Mat_No),
        MA_Name: this.dataService.concept_master_sapno[i].MA_Name,
        Packsize: this.dataService.concept_master_sapno[i].Packsize,
        Company: this.dataService.concept_master_sapno[i].Company.Company,
        Company_Id: this.dataService.concept_master_sapno[i].Company.id,
        MA_No: String(this.dataService.concept_master_sapno[i].MA_No),
        NTIN: this.dataService.concept_master_sapno[i].NTIN,
        API_Manufacturer: this.dataService.concept_master_sapno[i].API_Manufacturer.Manufacturer,
        API_Manufacturer_Id: this.dataService.concept_master_sapno[i].API_Manufacturer.id,
        Manufacturer: this.dataService.concept_master_sapno[i].Manufacturer.Manufacturer,
        Manufacturer_Id: this.dataService.concept_master_sapno[i].Manufacturer.id,
        EU: this.dataService.concept_master_sapno[i].EU.EU,
        EU_Id: this.dataService.concept_master_sapno[i].EU.id
      };
      this.data_for_json.push(entry); 
      this.data_for_xls.push(entry); 
    }
    debugger;
  }

  getDataBatches() {
    this.csvContent = "id;MA_No;FP_Batch_No;Bulk_Batch_No;Manufacturing_Date;Expiry_Date;Release_Blocking_Site\r\n";
    this.data_for_xls = [];
    debugger;
    for ( let i = 0; i < this.dataService.concept_batches.length; i++) {
      this.csvContent  += this.dataService.concept_batches[i].id + ";" + this.dataService.concept_batches[i].MA_No + ";" +
        this.dataService.concept_batches[i].FP_Batch_No + ";" + this.dataService.concept_batches[i].Bulk_Batch_No + ";" + 
        this.dataService.concept_batches[i].Manufacturing_Date + ";" + this.dataService.concept_batches[i].Expiry_Date + ";" +
        this.dataService.concept_batches[i].RB_Site + "\r\n";
      let entry = {
        id:  this.dataService.concept_batches[i].id,
        SAP_Mat_No: this.dataService.concept_batches[i].SAP_Mat_No,
        MA_No: this.dataService.concept_batches[i].MA_No,
        FP_Batch_No: this.dataService.concept_batches[i].FP_Batch_No,
        Bulk_Batch_No: this.dataService.concept_batches[i].Bulk_Batch_No,
        Manufacturing_Date: this.dataService.concept_batches[i].Manufacturing_Date,
        Expiry_Date: this.dataService.concept_batches[i].Expiry_Date,
        Sample_Receipt_Date: this.dataService.concept_batches[i].Sample_Receipt_Date,
        RB_Marketing_Date: this.dataService.concept_batches[i].RB_Marketing_Date,
        RB_Sale_Date: this.dataService.concept_batches[i].RB_Sale_Date,
        RB_Site: this.dataService.concept_batches[i].RB_Site,
        RB_Site_Id: this.dataService.concept_batches[i].RB_Site_Id,
        Status_Id: this.dataService.concept_batches[i].Status_Id,
        BRRor_Resp_Id: this.dataService.concept_batches[i].BRRor_Resp_Id,
        QAPM_Resp_Id: this.dataService.concept_batches[i].QAPM_Resp_Id,
        QP_Resp_Id: this.dataService.concept_batches[i].QP_Resp_Id,
        Priority_Id: this.dataService.concept_batches[i].Priority_Id,
        Category_Id: this.dataService.concept_batches[i].Category_Id,
        Status_Batch_Docs_Id: this.dataService.concept_batches[i].Status_Batch_Docs_Id,
        Batch_Docs_Date: this.dataService.concept_batches[i].Batch_Docs_Date,
        Docu_Comment: this.dataService.concept_batches[i].Docu_Comment,
        Consecutive_Number: this.dataService.concept_batches[i].Consecutive_Number,
        Temp_Eval_Completed: this.dataService.concept_batches[i].Temp_Eval_Completed,
        Lab_Chem: this.dataService.concept_batches[i].Lab_Chem,
        CoA_Chem_Exp: this.dataService.concept_batches[i].CoA_Chem_Exp,
        CoA_Chem_Rec: this.dataService.concept_batches[i].CoA_Chem_Rec,
        Lab_Add: this.dataService.concept_batches[i].Lab_Add,
        CoA_Add_Rec: this.dataService.concept_batches[i].CoA_Add_Rec,
        Reanalysis_Comment: this.dataService.concept_batches[i].Reanalysis_Comment
      };
      this.data_for_json.push(entry); 
      this.data_for_xls.push(entry); 
    }
    debugger;
  }

  getDataCsvResponsibles() {
    this.index = 1;
    this.data_for_json = [];
    this.data_for_csv = [];
    this.data_for_xls = [];
    this.csvContent = "id;shortcut;responsible\r\n";
    for (let i = 0; i < this.responsibles.length; i++) {
      let id = this.dataService.createId();
      this.csvContent += id + ";" + this.responsibles[i].shortcut + ";"  + this.responsibles[i].responsible + "\r\n";
      let entry = {
        id: id,
        content:  this.responsibles[i].shortcut,
        content2:  this.responsibles[i].responsible
      };
      let xlsentry = {
        Responsible_Id: id,
        Shortcut:  this.responsibles[i].shortcut,
        Responsible:  this.responsibles[i].responsible
      };
      this.data_for_xls.push(xlsentry);
      this.data_for_json.push(entry);
      this.data_for_csv.push(this.csvContent);
    }
    this.tableDataSource = new MatTableDataSource(this.data_for_json);
  }

  getDataCsvStatus() {
    this.csvContent = "id;shortcut;status\r\n";
    this.data_for_xls = []
    for ( let i = 0; i < this.dataService.concept_status.length; i++) {
      this.csvContent  += this.dataService.concept_status[i].id + ";" + this.dataService.concept_status[i].shortcut + ";" + 
        this.dataService.concept_status[i].status + "\r\n";
      let entry = {
        id:  this.dataService.concept_status[i].id,
        content: this.dataService.concept_status[i].shortcut,
        content2: this.dataService.concept_status[i].status
      };
      this.data_for_json.push(entry);
      let xlsentry = {
        Status_Id:  this.dataService.concept_status[i].id,
        Shortcut: this.dataService.concept_status[i].shortcut,
        Status: this.dataService.concept_status[i].status
      };
      this.data_for_xls.push(xlsentry);
    }
    this.tableDataSource = new MatTableDataSource(this.data_for_json);
  }

  getDataCsvPriorities() {
    this.index = 1;
    this.data_for_json = [];
    this.data_for_csv = [];
    this.data_for_xls = [];
    this.csvContent = "id;shortcut;priority\r\n";
    for (let i = 0; i < this.priorities.length; i++) {
      let id = this.dataService.createId();
      this.csvContent += id + ";" + this.priorities[i].shortcut + ";"  + this.priorities[i].priority + "\r\n";
      let entry = {
        id: id,
        content:  this.priorities[i].shortcut,
        content2:  this.priorities[i].priority
      };
      let xlsentry = {
        Priority_Id: id,
        Shortcut:  this.priorities[i].shortcut,
        Priority:  this.priorities[i].priority
      };
      this.data_for_xls.push(xlsentry);
      this.data_for_json.push(entry);
      this.data_for_csv.push(this.csvContent);
    }
    this.tableDataSource = new MatTableDataSource(this.data_for_json);
  }

  getCategoriesCsv() {
    this.csvContent = "id;Category\r\n";
    this.data_for_xls = []
    for ( let i = 0; i < this.dataService.concept_categories.length; i++) {
      this.csvContent  += this.dataService.concept_categories[i].id + ";" + this.dataService.concept_categories[i].Category + "\r\n";
      let entry = {
        id:  this.dataService.concept_categories[i].id,
        content: this.dataService.concept_categories[i].Category,
        content2: ""
      };
      this.data_for_json.push(entry);
      let xlsentry = {
        Category_Id:  this.dataService.concept_categories[i].id,
        Category: this.dataService.concept_categories[i].Category
      };
      this.data_for_xls.push(xlsentry);
    }
    this.data_for_json = this.data_for_json.sort((a: { content: string; }, b: { content: string; }) => {
      if (a.content < b.content) {
        return -1;
      }
      if (a.content > b.content) {
        return 1;
      }
      return 0;
    });
    this.tableDataSource = new MatTableDataSource(this.data_for_json);
  }

  setTreeIndex(node: CSVNode) {
    this.treeIndex = node.index;
    this.csvTitle = node.name;
  }

  displayTable() {
    if (this.treeIndex !== 9 && this.treeIndex !== 17) this.index = 2;
    if (this.treeIndex === 9) this.index = 3;
    if (this.treeIndex === 17) this.index = 5;
    if (this.treeIndex === 18) this.index = 7;
  }

  exportAsXlsx() {
    this.dataService.exportAsExcelFile(this.data_for_xls);
  }

  exportAsCsv() {
    this.dataService.exportToCSV(this.data_for_json);
  }

  getHeader() {
    if (this.treeIndex === 2 || this.treeIndex === 12) return "EU / Non-Eu";
    if (this.treeIndex === 3 || this.treeIndex === 3) return "Company";
    if (this.treeIndex === 4 || this.treeIndex === 10) return "Manufacturer";
    if (this.treeIndex === 5) return "API Manufacturer";
    if (this.treeIndex === 14 || this.treeIndex === 3) return "Category";
    if (this.treeIndex === 15 || this.treeIndex === 3 || this.treeIndex === 16 || this.treeIndex === 19) return "Shortcut";
    if (this.treeIndex === 6 || this.treeIndex === 13) return "Release Blocking Site";
    return "";
  }

  getHeader2() {
    if (this.treeIndex === 15) return "Responsible Person";
    if (this.treeIndex === 16) return "Priority";
    if (this.treeIndex === 19) return "Status";
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
  },
  {
    name: 'Auszug Extedo Pulse_Registered Product_All_Products.xlsx',
    children: [
      { index: 7, name: 'Article Master' },
      { index: 8, name: 'Countries' }
    ],
    index: 99
  },
  {
    name: 'Batch release overview Jan-to-Mar-2024.xlsx',
    children: [
      { index: 9, name: 'Batch Release Material - Master' },
      { index: 18, name: 'Batch Release Material - Master by SAP Mat. No.' },
      { index: 17, name: 'Batches' },
      { index: 10, name: 'Manufacturers' },
      { index: 11, name: 'Companies' },
      { index: 12, name: 'EU / Non-EU' },
      { index: 13, name: 'Release Blocking Sites' },
      { index: 14, name: 'Categories' },
      { index: 15, name: 'Responsible Persons' },
      { index: 16, name: 'Priorities' },
      { index: 19, name: 'Status' }
    ],
    index: 99
  }
];