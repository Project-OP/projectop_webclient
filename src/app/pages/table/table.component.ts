import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rx';
import { Subscription } from 'rxjs';
import { CommunitycardsComponent } from 'src/app/components/communitycards/communitycards.component';
import { MenuComponent } from 'src/app/components/menu/menu.component';

import { MsgdialogComponent } from 'src/app/components/msgdialog/msgdialog.component';
import { SeatComponent } from 'src/app/components/seat/seat.component';
import { ClientapiService } from 'src/app/services/clientapi.service';
import { HotkeyService } from 'src/app/services/hotkey.service';
import { PingpongService } from 'src/app/services/pingpong.service';
import { Card_Client } from 'src/pots/client_data/Card_Client';
import { ClientError } from 'src/pots/client_data/ClientError';
import { MyRoom } from 'src/pots/client_data/MyRoom';
import { Player_Client } from 'src/pots/client_data/Player_Client';
import { Room_Client } from 'src/pots/client_data/Room_Client';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  private ego: SeatComponent;
  private egoPos = -1;
  private callValue = 0;
  private turnAction = "";
  private turnValue = 0;
  private ws_subscription: Subscription;

  @ViewChild('msgbox') 
  msgbox: MsgdialogComponent; 

  @ViewChild('menu') 
  menu: MenuComponent; 

  @ViewChild('cards') 
  cards: CommunitycardsComponent; 

  

  public seatcount = 8;

  @ViewChildren('seats') 
  seats_elem: QueryList<SeatComponent>;

  @ViewChild('table') 
  table: ElementRef;

  seats: Array<Player_Client>;
  room: Room_Client;

  center: Card_Client[] = []

  private onRoomSubscription: Subscription; 
  private onError: Subscription; 

  private dirtyTurn = false;

  constructor(
    private api: ClientapiService,
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private router: Router,
    private ws: PingpongService
    ) 
    {
      const seats_init: Array<Player_Client> = [];
      for (let i = 0; i < 8; i++){
        seats_init.push(Player_Client.Empty());
      }
      
      this.seats = seats_init;
      this.seats_elem = new QueryList<SeatComponent>();
      this.room = new Room_Client();

      this.seats_elem.forEach((v, i)=>{
        v.index = i;
        const c = new Player_Client();
        c.Name = "Player "+i;
        v.player = c;
        
      });

  
    }
  
    
  @HostListener('document:keydown', ['$event'])
  handleKeyboardDownEvent(event: KeyboardEvent) {
    let shift = "";
    if (event.shiftKey){
      shift = "shift.";
    }
    let n = shift+event.key;
    switch(n){
      case "ArrowUp":
        this.hotkeyTurnAction(this.turnValue += this.room.table.current_bb);
      break;
      case "shift.ArrowUp":
        this.hotkeyTurnAction(this.turnValue += this.room.table.current_bb*5);
      break;

      case "ArrowDown":
        this.hotkeyTurnAction(this.turnValue -= this.room.table.current_bb);
      break;
      case "shift.ArrowDown":
        this.hotkeyTurnAction(this.turnValue -= this.room.table.current_bb*5);
      break;
    }
  }
  
  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) {
      

      let shift = "";
      if (event.shiftKey){
        shift = "shift.";
      }
      let n = shift+event.key;
      switch(n){
          case "Enter":
            const winner = this.room?.table?.winner_pos?.length > 0;
            const notactive = !this.room.table.active;
            this.dirtyTurn = false;
            if (notactive || winner){

            this.api.NewRound();
              return;
            }
            if (this.turnAction == "sit out"){
            this.api.Sitout(false);
              return;
            }
            if (this.turnAction == ""){
              this.hotkeyTurnAction(0);
            }
            const v = this.turnValue;
            if (this.room.table.player_turn != this.egoPos){
              this.ego.setaction = "NOT YOUR TURN";
                setTimeout(()=>{
                  this.ego.setaction = "not your turn";
                },500);
              return;
            }
            this.api.Turn(v);
            this.turnValue = 0;
            this.turnAction = "";
        break;
        
        case " ":
          this.hotkeyTurnAction(this.room.table.current_min_bet);
        break;

        case "n":
          console.log("notify turn");
          this.api.NotifyTurn();
        break;

        case "f":
          this.hotkeyTurnAction(-1,true);
        break;

        case "a":
          this.hotkeyTurnAction(this.room.seats[this.room.table.egoPos].Balance);
        break;

        case "o":
          this.turnAction = "sitout";
          if (this.room.table.player_turn != this.room.table.egoPos){
            const e = this.room.seats[this.egoPos];
            const sout = !e.roundturn.join_next_round && (e.roundturn.sitout ||e.roundturn.sitout_next_turn);
            console.log(!e.roundturn.join_next_round ,e.roundturn.sitout ,e.roundturn.sitout_next_turn);
            this.api.Sitout(sout);
          }else{
            this.hotkeyTurnAction(-1,true,true);
          }
        break;

        case "shift.F":
          this.api.Admin_Fold();
        break;

        case "shift.R":
          this.api.Admin_Revoke();
        break;

        case "shift.G":
          this.api.Admin_Promote();
        break;

        case "shift.K":
          this.api.Admin_Kick();
        break;

        case "+":
          let b = this.ego.balance+10;
          if (b < 0){
            b = 0;
          }
          this.api.Admin_SetAmount(b);
        break;

        case "-":
          b = this.ego.balance-10;
          if (b < 0){
            b = 0;
          }
          this.api.Admin_SetAmount(b);
        break;

        case "shift.+":
          b = this.ego.balance+50;
          if (b < 0){
            b = 0;
          }
          this.api.Admin_SetAmount(b);
        break;

        case "shift.-":
          b = this.ego.balance-50;
          if (b < 0){
            b = 0;
          }
          this.api.Admin_SetAmount(b);
        break;



      }
    
  }

  
    
  async ngOnInit(): Promise<void> {

    this.ws.Connect();
    this.onError = this.api.OnApiError.subscribe((e: ClientError) => {
      console.log("error",e);
      this.msgbox.setError(e);
    });

    this.onRoomSubscription = this.api.OnRoomData.subscribe((s: string) => {
      if (s == "leave"){
        this.router.navigate(['/lobby']);
        return;
      }
      
      console.log("event: ",s);
      this.room = this.api.room;
      
      this.RenderRoom();
    });

    const id = this.route.snapshot.paramMap.get("roomid?");
    if (id == null){
      const r = await this.api.GetMyRoom();
      if (r instanceof ClientError){
        this.msgbox.setError(r);
      }else{
        const rid: MyRoom = r;
        const id = rid.roomid;
        this.router.navigate(['/table',id]);

      }
    }else{
      const r = await this.api.Enter(id);
      if (r instanceof ClientError){
        this.msgbox.setError(r);
      }else{
        const room: Room_Client = r;
        this.room = room;
        this.RenderRoom();

      }
      
    }


    
    this.ws_subscription = this.ws.wsMessages.subscribe((o: string)=>{
      if (o.startsWith("Hey")){
        const num = Number.parseInt(o.slice(4,5));    
        this.seats_elem.toArray()[num].nudge = true;
    
        setTimeout(()=>{
      
            this.seats_elem.toArray()[num].nudge = false;
        },300);
              
      }
    });

  }

  private hotkeyTurnAction(value: number = -1, fold=false, sitout=false){
    if (this.egoPos < 0 || this.room.table.player_turn != this.egoPos){
      return;
    }

    if (value < this.room.seats[this.room.table.egoPos].Balance && value > this.room.table.current_min_bet){
      value = value - (value % this.room.table.current_bb);
    }
    if (value < this.callValue){
      value = this.callValue;
    }

    if (value > this.room.seats[this.room.table.egoPos].Balance){
      value = this.room.seats[this.room.table.egoPos].Balance;
    }

    if (value == this.callValue){
      this.turnAction = "call";
    }
    if (value == 0){
      this.turnAction = "check";
    }
    if (value > this.callValue){
      this.turnAction = "raise";
    }
    
    if (value == this.room.seats[this.room.table.egoPos].Balance){
      this.turnAction = "all in";
    }



    if (fold){

      value = -1;
      this.turnAction = "fold";
    }

    if (sitout){
      value = -1;
      this.turnAction = "sit out";
    }
    
    
    
    this.turnValue = value;
    let v = "";
    if (value >= 0){
      v = ""+value;
    }

    if (this.ego){
      this.ego.setaction = this.turnAction+ " "+v;
    }
    
    
  }

  ngAfterViewInit(){
    this.document.body.classList.add('table_background');
    this.document.body.classList.remove('lobby_background');
    //console.log(this.seats_elem.toArray());
    const table_dom = this.table.nativeElement;
    //console.log(table_dom.offsetWidth, table_dom.offsetHeight );
    this.checkPeriodically();
    

  }

  checkPeriodically(){
    console.log("check");
    setTimeout(()=>{
      if (this.room){
        if (this.room.id != "" &&  this.room.table.egoPos == -1){
          this.api.Refresh();  
        }
        if (this.room.table.egoPos > -1){
          console.log("check done");
          return;
        }
        this.checkPeriodically();
      }
    },5000);
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: string) {
    const table_dom = this.table.nativeElement;
    
  }


  private RenderRoom(): void{
    if (this.room == null){
      return;
    }
    
    let egoPos = -1;

    this.room.seats.forEach((seat, pos)=>{
      if(seat.you){
        this.egoPos = pos;
      }
    });
    egoPos = this.egoPos;
    
    if (egoPos != -1){
      this.callValue = this.room.table.current_min_bet - this.room.seats[egoPos].roundturn.amount;
      this.callValue = Math.max(this.callValue, 0);
    }
    
    
    const winners = this.room.table.winner_pos;
    const seat_components = this.seats_elem.toArray();

    this.menu.canstart = !this.room.table.active;
    let playerIsSitting = false;
    
    if(egoPos != -1){
      playerIsSitting = true;
    }

    this.room.seats.forEach((seat, pos)=>{
      if (seat != null){
        if (seat.you){
          this.ego = seat_components[pos];
        }
        const component = seat_components[pos];
        seat_components[pos].playerIsSitting = playerIsSitting;
        if (winners){
          const sIsInWinner = winners.includes(pos);
          component.playerWon = sIsInWinner;
        }
        
        const sHasTurn = pos == this.room.table.player_turn;
  
        
        component.playerTurn = sHasTurn;
        console.log("raction",seat.roundturn.round_action);
        if (pos != egoPos){
          component.setaction = seat.roundturn.round_action;
        }
        

        component.player = seat;
        component.index = pos;
        component.room = this.room.id;

      }

      if (!this.dirtyTurn){
        this.hotkeyTurnAction(this.callValue);
      }
      

    
      
    });

    


  }



  async ngOnDestroy(): Promise<void>{
    this.ws_subscription.unsubscribe();

    this.onRoomSubscription.unsubscribe();
    this.onError.unsubscribe();
    await this.api.Leave();
  }
}
