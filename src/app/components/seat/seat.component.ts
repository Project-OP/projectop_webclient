import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.css']
})
export class SeatComponent implements OnInit {

  cards: CardComponent[];
  public x:number;
  public y:number;
  public w:number;
  public h:number;

  constructor() {
    this.cards = new Array<CardComponent>();
    this.cards.push(new CardComponent());
    this.cards.push(new CardComponent());

    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

   }

  ngOnInit(): void {
  }

}
