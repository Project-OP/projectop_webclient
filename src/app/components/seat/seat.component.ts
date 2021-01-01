import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.css']
})
export class SeatComponent implements OnInit {

  cards: CardComponent[];

  constructor() {
    this.cards = new Array<CardComponent>();
    this.cards.push(new CardComponent());
    this.cards.push(new CardComponent());


   }

  ngOnInit(): void {
  }

}
