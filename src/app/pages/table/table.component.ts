import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rx';
import { Subscription } from 'rxjs';
import { AdminwindowComponent } from 'src/app/components/adminwindow/adminwindow.component';
import { CommunitycardsComponent } from 'src/app/components/communitycards/communitycards.component';
import { MenuComponent } from 'src/app/components/menu/menu.component';

import { MsgdialogComponent } from 'src/app/components/msgdialog/msgdialog.component';
import { SeatComponent } from 'src/app/components/seat/seat.component';
import { ClientapiService } from 'src/app/services/clientapi.service';
import { HotkeyService } from 'src/app/services/hotkey.service';
import { PingpongService } from 'src/app/services/pingpong.service';
import { UieventService, TurnAction, TurnActionType, SimpleUIEvent } from 'src/app/services/uievent.service';
import { Card_Client } from 'src/pots/client_data/Card_Client';
import { ClientError } from 'src/pots/client_data/ClientError';
import { MyRoom } from 'src/pots/client_data/MyRoom';
import { Player_Client } from 'src/pots/client_data/Player_Client';
import { Room_Client } from 'src/pots/client_data/Room_Client';
import { WS, WSJsonMsg, WSType } from 'src/pots/data/WS';
import { ErrorInfo } from 'src/pots/ErrorInfo';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  private ego: SeatComponent;
  private egoPos = -1;
  private turnAction = "";
  private turnValue = 0;
  private ws_subscription: Subscription;

  private viewportscaling = true;

  @ViewChild('msgbox') 
  msgbox: MsgdialogComponent; 

  @ViewChild('menu') 
  menu: MenuComponent; 

  @ViewChild('cards') 
  cards: CommunitycardsComponent; 

  @ViewChild('admin') 
  admin: AdminwindowComponent;

  private nudgeAudio = new Audio();
  
  private applyView = true;

  private _zoom = 1;
  public get zoom(): string{
    if (!this.viewportscaling){
      return "";
    }
    return `scale(${this._zoom})`;
  } 

  public  admintransform = "";


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


  constructor(
    private api: ClientapiService,
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private router: Router,
    private ws: PingpongService,
    private uiEvent: UieventService
    ) 
    {
      this.nudgeAudio.src = "/assets/snd/notify.mp3";
      this.nudgeAudio.load();
    
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



      this.uiEvent.TurnActionLabelChange.subscribe((s)=>{
        let v = "";
        if (this.uiEvent.TurnValue >= 0){
          v = ""+this.uiEvent.TurnValue;
        }
        this.turnAction = s;

        if (this.ego){
          this.ego.setaction = s+ " "+v;
        }
      });

      this.uiEvent.SimpleEvent.subscribe((e)=>{
        if (e == SimpleUIEvent.TOGGLE_VIEWPORTSCALING){
          this.viewportscaling = !this.viewportscaling;
          this.onResize("");
        }
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
        this.uiEvent.TurnAction.next(TurnAction.RAISE.amount(1));
        event.preventDefault();

      break;
      case "shift.ArrowUp":
        this.uiEvent.TurnAction.next(TurnAction.RAISE.amount(5));
        
        event.preventDefault();

      break;

      case "ArrowDown":
        this.uiEvent.TurnAction.next(TurnAction.RAISE.amount(-1));
        
        event.preventDefault();

      break;
      case "shift.ArrowDown":
        this.uiEvent.TurnAction.next(TurnAction.RAISE.amount(-5));

        event.preventDefault();
      break;
    }
  }


  
  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) {
      let b;
      let newBB;
      let shift = "";
      if (event.shiftKey){
        shift = "shift.";
      }
      let n = shift+event.key;
      switch(n){
          case "Enter":

            this.uiEvent.TurnAction.next(TurnAction.SUBMIT);
            event.preventDefault();

        break;
        
        case " ":
          this.uiEvent.TurnAction.next(TurnAction.CALL);
          event.preventDefault();

        break;

        case "n":
          this.uiEvent.SimpleEvent.next(SimpleUIEvent.NUDGE);
          event.preventDefault();

        break;

        case "f":
          this.uiEvent.TurnAction.next(TurnAction.FOLD);

          event.preventDefault();

        break;

        case "a":
          this.uiEvent.TurnAction.next(TurnAction.ALLIN);
          event.preventDefault();

        break;

        case "o":
          this.uiEvent.TurnAction.next(TurnAction.SITOUT);
          
          event.preventDefault();

        break;

        case "shift.F":
          this.uiEvent.SimpleEvent.next(SimpleUIEvent.ADMIN_FOLD);
        event.preventDefault();

        break;

        case "shift.R":
          this.uiEvent.SimpleEvent.next(SimpleUIEvent.ADMIN_REVOKE);

          event.preventDefault();
          

        break;

        case "shift.G":
          this.uiEvent.SimpleEvent.next(SimpleUIEvent.ADMIN_PROMOTE);

          event.preventDefault();

        break;

        case "shift.K":
          this.uiEvent.SimpleEvent.next(SimpleUIEvent.ADMIN_KICK);

          event.preventDefault();

        break;

        case "+":
          this.uiEvent.SimpleEvent.next(SimpleUIEvent.ADMIN_PLUS);
          event.preventDefault();

        break;

        case "-":
          this.uiEvent.SimpleEvent.next(SimpleUIEvent.ADMIN_MINUS);

          event.preventDefault();

        break;

        case "shift.+":
          this.uiEvent.SimpleEvent.next(SimpleUIEvent.ADMIN_BLIND_PLUS);

          event.preventDefault();

        break;

        case "shift.-":
          this.uiEvent.SimpleEvent.next(SimpleUIEvent.ADMIN_BLIND_MINUS);

          event.preventDefault();

        break;

        case  "v":
          this.uiEvent.SimpleEvent.next(SimpleUIEvent.TOGGLE_VIEWPORTSCALING);
          event.preventDefault();
        break

        

      }
    
  }

  
    
  async ngOnInit(): Promise<void> {

    this.ws.Connect();
    this.onError = this.api.OnApiError.subscribe((e: ClientError) => {
        this.displayError(e);
    });

    this.onRoomSubscription = this.api.OnRoomData.subscribe((s: string) => {
      if (s == "leave"){
        this.router.navigate(['/lobby']);
        return;
      }
      
      this.room = this.api.room;
      
      this.RenderRoom();
    });

    const id = this.route.snapshot.paramMap.get("roomid?");
    if (id == null){
      const r = await this.api.GetMyRoom();
      if (r instanceof ClientError){
        this.displayError(r);
      }else{
        const rid: MyRoom = r;
        const id = rid.roomid;
        this.router.navigate(['/table',id]);

      }
    }else{
      const r = await this.api.Enter(id);
      if (r instanceof ClientError){
        this.displayError(r);
      }else{
        const room: Room_Client = r;
        this.room = room;
        this.RenderRoom();

      }

      this.applyView = true;

      this.onResize("");
      
    }


    
    this.ws_subscription = this.ws.wsMessages.subscribe((o: WSJsonMsg)=>{
      if (o.type == WSType.NUDGE.code){
       
        const num = Number.parseInt(o.body);    
        
        if (num < 0){
          return;
        }
        this.seats_elem.toArray()[num].nudge = true;
    
        setTimeout(()=>{
      
            this.seats_elem.toArray()[num].nudge = false;
        },300);
        if (this.egoPos == num){
          this.nudgeAudio.play();
        }
      
      }
    });

  }
  /*
  let v = "";
  if (value >= 0){
    v = ""+value;
  }
  // on seat action label change
  if (this.ego){
    this.ego.setaction = this.turnAction+ " "+v;
  }
*/
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
        if (this.room.table.egoPos > -1 && this.room.table.active){
          console.log("check done");
          return;
        }
        this.checkPeriodically();
      }
    },1000);
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: string) {
    if (!this.applyView){
      return;
    }
    //const table_dom = this.table.nativeElement;
    const w = document.body.clientWidth / 1200;
    const h = document.body.clientHeight / 800;
    this._zoom = Math.min(w,h);

    if (!this.viewportscaling){
      this.admintransform = "translateX(-50%)";  
      return;
    }
    this.admintransform =`scale(${this._zoom}) translateX(-50%)`;

    
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
        component.playerWon = false;
        if (winners && winners.length > 0){
          const sIsInWinner = winners.map(v=>v.seat).includes(pos);
          component.playerWon = sIsInWinner;
        }
        const sHasTurn = pos == this.room.table.player_turn;
  
        
        component.playerTurn = sHasTurn;
        //console.log("raction",seat.roundturn.round_action);
        if (pos != egoPos){
          component.setaction = seat.roundturn.round_action;
        }
        

        component.player = seat;
        component.index = pos;
        component.room = this.room.id;

      }


      if (!this.uiEvent.turnActionDirty){
        this.uiEvent.TurnAction.next(TurnAction.CALL);
      }
      
      
      
    });

    


  }

  private displayError(r: ClientError){


    if (ErrorInfo.GetErrorInfo(r) == ErrorInfo.NOT_YOUR_TURN){

      this.ego.setaction = "NOT YOUR TURN";
      setTimeout(()=>{
        this.ego.setaction = "not your turn";
      },500);
      return;

    }else if(ErrorInfo.GetErrorInfo(r) == ErrorInfo.NOT_ENOUGH_PLAYER){
      console.log("not enough player");
      return;
    }else if (ErrorInfo.GetErrorInfo(r) == ErrorInfo.UNKNOWN){
      console.log("error",r);
      return;
    }else{
      this.msgbox.setError(r);
    }
  }

  async ngOnDestroy(): Promise<void>{
    this.ws_subscription.unsubscribe();

    this.onRoomSubscription.unsubscribe();
    this.onError.unsubscribe();
    await this.api.Leave();
  }
}
