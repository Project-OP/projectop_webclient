import { Component, OnInit } from '@angular/core';
import { ClientapiService } from 'src/app/services/clientapi.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  canstart = false;
  constructor(private api: ClientapiService) { }

  ngOnInit(): void {
  }

  leave(){
    this.api.Leave();
  }

  start(){
    this.api.StartGame();
    
  }
}
