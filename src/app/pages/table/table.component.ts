import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommunitycardsComponent } from 'src/app/components/communitycards/communitycards.component';
import { MenuComponent } from 'src/app/components/menu/menu.component';

import { MsgdialogComponent } from 'src/app/components/msgdialog/msgdialog.component';
import { SeatComponent } from 'src/app/components/seat/seat.component';
import { ClientapiService } from 'src/app/services/clientapi.service';
import { HotkeyService } from 'src/app/services/hotkey.service';
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

  private onRoomSubscription: Subscription; 
  private onError: Subscription; 


  constructor(
    private api: ClientapiService,
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private router: Router,
    private hotkeys: HotkeyService
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
    


  async ngOnInit(): Promise<void> {
    
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

    // hotkeys
    this.hotkeys.addShortcut({ keys: 'enter' }).pipe().subscribe(()=>{
      if (this.room.table.winner_pos.length > 0){
        this.api.NewRound();
        return;
      }
      if (this.turnAction == ""){
        this.hotkeyTurnAction(0);
      }
      this.api.Turn(this.turnValue);
    });

    this.hotkeys.addShortcut({ keys: 'space' }).pipe().subscribe(()=>{
      console.log("check/call");
      this.hotkeyTurnAction(this.room.table.current_min_bet);
      

    });

    this.hotkeys.addShortcut({ keys: 'f' }).pipe().subscribe(()=>{
      this.hotkeyTurnAction(-1,true);
    });


    this.hotkeys.addShortcut({ keys: 'a' }).pipe().subscribe(()=>{
      console.log("all in");
      this.hotkeyTurnAction(this.room.seats[this.room.table.egoPos].Balance);
    });

    this.hotkeys.addShortcut({ keys: 'ArrowUp' },true).pipe().subscribe(()=>{
      console.log("raise");
      this.hotkeyTurnAction(this.turnValue += this.room.table.current_bb);
    });

    this.hotkeys.addShortcut({ keys: 'shift.ArrowUp' },true).pipe().subscribe(()=>{
      console.log("raise more");
      this.hotkeyTurnAction(this.turnValue += this.room.table.current_bb*5);
    });

    this.hotkeys.addShortcut({ keys: 'ArrowDown' },true).pipe().subscribe(()=>{
      console.log("lower raise");
      this.hotkeyTurnAction(this.turnValue -= this.room.table.current_bb);
    });

    this.hotkeys.addShortcut({ keys: 'shift.ArrowDown' },true).pipe().subscribe(()=>{
      console.log("lower raise more");
      this.hotkeyTurnAction(this.turnValue -= this.room.table.current_bb*5);

    });

    
  }

  private hotkeyTurnAction(value: number = -1, fold=false){
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
    
    
    
    this.turnValue = value;
    let v = "";
    if (value >= 0){
      v = ""+value;
    }

    if (this.ego){
      this.ego.action = this.turnAction+ " "+v;
    }
    
    
  }

  ngAfterViewInit(){
    this.document.body.classList.add('table_background');
    this.document.body.classList.remove('lobby_background');
    //console.log(this.seats_elem.toArray());
    const table_dom = this.table.nativeElement;
    //console.log(table_dom.offsetWidth, table_dom.offsetHeight );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: string) {
    const table_dom = this.table.nativeElement;
    
  }


  private RenderRoom(): void{
    if (this.room == null){
      return;
    }
    
    this.egoPos = this.room.table.egoPos;
    
    const notstarted = this.room.table.active;
    const dealerpos = this.room.table.dealerpos;
    const centercards = this.room.table.cards_center;
    const egoPos = this.room.table.egoPos;
    
    this.callValue = this.room.table.current_min_bet - this.room.seats[egoPos].roundturn.amount;
    this.callValue = Math.max(this.callValue, 0);
    const winners = this.room.table.winner_pos;
    const current_turn_pos = this.room.table.player_turn;
    const seat_components = this.seats_elem.toArray();

    this.menu.canstart = !this.room.table.active;

    this.room.seats.forEach((seat, pos)=>{
      if (seat != null){
        if (seat.you){
          this.ego = seat_components[pos];
        }
        const component = seat_components[pos];
        seat_components[pos].playerIsSitting = egoPos > 0;
        
        const sIsInWinner = winners.includes(pos);
        const sHasTurn = pos == this.room.table.player_turn;
  
        component.playerWon = sIsInWinner;
        component.playerTurn = sHasTurn;


        component.player = seat;
        component.index = pos;
        component.room = this.room.id;

      }

      this.hotkeyTurnAction(this.callValue);

    
      
    });

    


  }

  ngOnDestroy(): void{
    this.onRoomSubscription.unsubscribe();
    this.onError.unsubscribe();
    
  }
}
