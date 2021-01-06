import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Card_Client } from 'src/pots/client_data/Card_Client';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-communitycards',
  templateUrl: './communitycards.component.html',
  styleUrls: ['./communitycards.component.css']
})
export class CommunitycardsComponent implements OnInit {

  
  @Input()
  cards_data: Card_Client[] = [];

   constructor() {
    
   }

  ngOnInit(): void {
  }

  

}
