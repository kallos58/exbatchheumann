import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  entries = 0;
  constructor( private router: Router ) {
  }


  cardClick(i: number) {
    this.router.navigate(['/batchrelease']);
  }

  exportToXls() {

  }

  clearFilter() {}
}
