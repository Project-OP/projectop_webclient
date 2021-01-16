import { Component,  Input, OnInit, QueryList,  ViewChildren } from '@angular/core';
import { ClientapiService } from 'src/app/services/clientapi.service';
import { Card_Client } from 'src/pots/client_data/Card_Client';
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
  room = "";
  _action:string = "";

  @Input()
  winner: Array<Card_Client[]> = [];

  get action(){
    if (this.playerWon){
      return "wins "+this.Player.win;
    }
    if (!this.playerTurn && !this.sitout && this.isEgo){
      if (this._action == "NOT YOUR TURN"){
        return this._action;
      }
      return "not your turn";
    }else{
      return this._action;
    }
  } 
 
  set setaction(v: string){
    this._action = v;
  }
  name: string = "Player ";
  balance: number = 0;
  sithere: string = "";//"sit here";
  playerIsSitting = false;
  isEgo = false;
  playerWon = false;
  playerTurn = false;
  sitout = false;
  fold = false;
  cardsvisible = false;

  sitoutfold="";

  nudge = false;
  
  @ViewChildren('cards') 
  cards: QueryList<CardComponent>; 


  

  constructor(private api: ClientapiService) {

    
  }

  get Player(){
    if (this._player == null){
      return Player_Client.Empty();
    }
    return this._player;
  }
  set player(p: Player_Client){  
    this.sitout = (p.roundturn.sitout_next_turn || p.roundturn.sitout ) && !p.roundturn.join_next_round;
    this.fold = p.roundturn.fold;
    this.cardsvisible = p.Cards?.filter(v=>v.visible).length > 0;
    if (this.fold){
      this.sitoutfold = "fold";
    }
     
    if (this.sitout){

      this.sitoutfold = "sit out";
    }    
    this._player = p;
    this.name = p.Name;
    this.balance = p.Balance;
    if (p.you){
      this.isEgo = true;
    }
    if (p.you && (p.roundturn.sitout || p.roundturn.sitout_next_turn)){
      this.sithere = "sit in";
    }else{
      this.sithere = "sit here";
    }
    

  }
  

  sitbtn(){
    if (this.sitout){
      console.log("sit back in");
      this.api.Sitout(true);
    }else{
      this.api.Sit(this.index);
    }
    
    //this.api.SitTest(this.room,this.index);
    
  }

  ngOnInit(): void {

  }

}
