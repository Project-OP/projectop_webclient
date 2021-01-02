import { Component, Input, OnInit } from '@angular/core';
import { Card_Client } from 'src/pots/client_data/Card_Client';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  private _card: Card_Client;

  @Input() 
  public ego = false;
  constructor() { }

  @Input() 
  set card(v: Card_Client){
    if (!v){
      return;
    }
    this._card = v;
    
  }
  
 get imgsrc(){
  if (!this._card){

    return "/assets/img/blanc.png";

  }else{
    if (this.ego){
      let v = this._card.value[0];
      if (this._card.value == "10"){
        v = "10"
      }
      return `/assets/img/cards_single/${this._card.color[0]}${v}.png`;
    }
    if (!this._card.visible){

      return "/assets/img/back.png";
    }else{
      let v = this._card.value[0];
      if (this._card.value == "10"){
        v = "10"
      }
      return `/assets/img/cards_single/${this._card.color[0]}${v}.png`;
    }
    
  }
  
 }



  ngOnInit(): void {
  }

}
