import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-communitycards',
  templateUrl: './communitycards.component.html',
  styleUrls: ['./communitycards.component.css']
})
export class CommunitycardsComponent implements OnInit {

  cards: CardComponent[] = [];

  constructor() {
    this.cards = new Array<CardComponent>();
    for (let i = 0; i < 5; i++){
      this.cards.push(new CardComponent());
    }
  
   }

  ngOnInit(): void {
  }

}
