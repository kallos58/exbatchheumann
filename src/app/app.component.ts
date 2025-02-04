import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MaterialModule } from './material.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor( private router: Router ) {
   
  }
  
  goHome() {
    this.router.navigate(['/']);
  }

  goDp() {
    this.router.navigate(['/datepicker']);
  }

  
}
