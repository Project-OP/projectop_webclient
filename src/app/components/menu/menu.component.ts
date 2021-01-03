import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientapiService } from 'src/app/services/clientapi.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  canstart = false;
  constructor(private api: ClientapiService, private router: Router) { }

  ngOnInit(): void {
  }

  async leave(){
    try{
      await this.api.Leave();
    }finally{
      this.router.navigate(['/lobby']);
    }
    
    

  }

  start(){
    this.api.StartGame();
    
  }
}
