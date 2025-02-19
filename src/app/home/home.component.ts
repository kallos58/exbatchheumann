import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../services/messageService';
import { DataService } from '../services/dataService';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-home',
  imports: [MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  entries = 0;
  constructor( 
    private router: Router,
    private messageService: MessageService,
    private dataService: DataService
  ) {
  }


  cardClick(i: number) {
    this.messageService.changeIndex("0");
    debugger;
    if ( i === 8 ) this.router.navigate(['/batchrelease']);
    if ( i === 9 ) this.router.navigate(['/settings']);
  }

  exportToXls() {

  }

  clearFilter() {}
}
