import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MaterialModule } from './material.module';
import { MessageService } from './services/messageService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  entries: string = "";
  constructor( 
    private router: Router,
    private messageService: MessageService
  ) {
   
  }
  
  ngOnInit() {
    this.messageService.entries.subscribe(e => this.entries = e);
  }

  goHome() {
    this.router.navigate(['/']);
  }
  
}
