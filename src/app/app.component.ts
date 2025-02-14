import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MaterialModule } from './material.module';
import { MessageService } from './services/messageService';
import { DataService } from './services/dataService';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  i = "1";
  entries: string = "";
  constructor( 
    private router: Router,
    private messageService: MessageService,
    private dataService: DataService
  ) {
  
  }
  
  ngOnInit() {
    this.messageService.entries.subscribe(e => this.entries = e);
    this.messageService.index.subscribe(e => this.i = e);
  }

  goHome() {
    this.router.navigate(['/']);
  }
  
}
