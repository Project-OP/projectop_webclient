import { Component, OnInit } from '@angular/core';
import { Player_Client } from 'src/pots/client_data/Player_Client';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.css']
})
export class SeatComponent implements OnInit {

  private _player: Player_Client = new Player_Client();
  index: number = 0;
  action:string = "checks";
  cards: CardComponent[];
  name: string = "Player ";
  balance: number = 0;
  sithere: string = "";//"sit here";
  constructor() {
    this.cards = new Array<CardComponent>();
    this.cards.push(new CardComponent());
    this.cards.push(new CardComponent());

  }

  set player(p: Player_Client){
    this._player = this.player;
    this.name = p.Name;
    this.balance = p.Balance;
  }
  

  ngOnInit(): void {
  }

}
