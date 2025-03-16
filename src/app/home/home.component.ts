import { Component } from '@angular/core';
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
export class HomeComponent {
  entries = 0;
  isPassed = false;
  invalid = false;
  username = "bm";
  password = "";
  constructor( 
    private router: Router,
    private messageService: MessageService,
    private dataService: DataService
  ) {
  }


  cardClick(i: number) {
    this.messageService.changeIndex("0");
    if ( i === 8 ) this.router.navigate(['/batchrelease']);
    if ( i === 9 ) this.router.navigate(['/settings']);
  }

  checkPw() {
    if (this.username != "bm" || this.password != "oesl") { 
      this.invalid = true;
    } else {
      this.isPassed = true;
    }
  }

  exportToXls() {

  }

  clearFilter() {}
}
