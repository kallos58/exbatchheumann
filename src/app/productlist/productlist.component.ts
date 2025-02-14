import { Component } from '@angular/core';
import { MaterialModule } from '../material.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterOutlet, Router } from '@angular/router';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-productlist',
  imports: [MaterialModule, MatGridListModule, RouterOutlet],
  templateUrl: './productlist.component.html',
  styleUrl: './productlist.component.css'
})
export class ProductlistComponent {
  constructor(
      private router: Router
    ) {}
  entries = "";
  tiles: Tile[] = [
    {text: 'One', cols: 1, rows: 3, color: 'lightblue'},
    {text: 'Two', cols: 3, rows: 1, color: 'lightgreen'},
    {text: 'Three', cols: 3, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 3, rows: 1, color: '#DDBDF1'},
  ];

  goHome() {
    this.router.navigate(['/']);
  }
}

