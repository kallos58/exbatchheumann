import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../services/messageService';
import { DataService } from '../services/dataService';
import { MaterialModule } from '../material.module';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MaterialModule, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  entries = 0;
  isPassed = true;
  invalid = false;
  username = "bm";
  password = "";
  isNotAllowedUser = false;
  constructor( 
    private router: Router,
    private messageService: MessageService,
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
      this.isPassed = this.dataService.isPassed;
  }

  cardClick(i: number) {
    this.messageService.changeIndex("0");
    if ( i === 8 ) this.router.navigate(['/batchrelease']);
    if ( i === 9 ) this.router.navigate(['/settings']);
    if ( i === 10 ) this.router.navigate(['/articlemaster']);
    if ( i === 11 ) this.router.navigate(['/datamigration']);
  }

  checkPw() {
    this.invalid = true;
    if (this.username === "bm" && this.password == "oesl") {
      this.invalid = false;
      this.dataService.isNotAllowedUser = true;
    }
    if (this.username === "bm" && this.password == "kallos") {
      this.invalid = false;
      this.dataService.isNotAllowedUser = false;
    }
    if (!this.invalid) {
      this.isPassed = true;
      this.dataService.isPassed = true;
      this.isNotAllowedUser = this.dataService.isNotAllowedUser;
    }
  }

  exportToXls() {

  }

  clearFilter() {}
}
