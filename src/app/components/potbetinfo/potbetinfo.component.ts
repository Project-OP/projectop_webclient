import { Component, Input, OnInit } from '@angular/core';
import { Room_Client } from 'src/pots/client_data/Room_Client';

@Component({
  selector: 'app-potbetinfo',
  templateUrl: './potbetinfo.component.html',
  styleUrls: ['./potbetinfo.component.css']
})
export class PotbetinfoComponent implements OnInit {

  @Input()
  set room(r: Room_Client){
    if (r == null){
      this.bets = ["","","","","","","",""];
      this.pot = 0;
      return;
    }

    r.seats.forEach((v,i)=>{
      if (v.empty){
        this.bets[i] = "";
      }else{
        this.bets[i] = ""+v.roundturn.amount;
      }
        
      
      
      
    });
    this.pot = r.table.pot;

  }



  bets: string[] = ["","","","","","","",""];
  pot: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
