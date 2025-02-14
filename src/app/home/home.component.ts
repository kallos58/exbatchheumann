import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../services/messageService';
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
    private messageService: MessageService
  ) {
  }


  cardClick(i: number) {
    this.messageService.changeIndex("0");
    if ( i === 8 ) this.router.navigate(['/batchrelease']);
    if ( i === 9 ) this.router.navigate(['/productlist']);
  }

  exportToXls() {

  }

  clearFilter() {}
}
