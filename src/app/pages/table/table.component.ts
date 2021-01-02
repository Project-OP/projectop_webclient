import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuComponent } from 'src/app/components/menu/menu.component';

import { MsgdialogComponent } from 'src/app/components/msgdialog/msgdialog.component';
import { SeatComponent } from 'src/app/components/seat/seat.component';
import { ClientapiService } from 'src/app/services/clientapi.service';
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
  @ViewChild('msgbox') 
  msgbox: MsgdialogComponent; 

  @ViewChild('menu') 
  menu: MenuComponent; 

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
    private router: Router
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
    
  }

  ngAfterViewInit(){
    this.document.body.classList.add('table_background');
    this.document.body.classList.remove('lobby_background');
    //console.log(this.seats_elem.toArray());
    const table_dom = this.table.nativeElement;
    //console.log(table_dom.offsetWidth, table_dom.offsetHeight );
    this.RenderRoom();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: string) {
    const table_dom = this.table.nativeElement;
    
  }


  private RenderRoom(): void{
    const notstarted = this.room.table.active;
    const dealerpos = this.room.table.dealerpos;
    const centercards = this.room.table.cards_center;
    const egoPos = this.room.table.egoPos;
    console.log("ego",egoPos);
    const winners = this.room.table.winner_pos;
    const current_turn_pos = this.room.table.player_turn;
    const seat_components = this.seats_elem.toArray();

    this.menu.canstart = !this.room.table.active;

    this.room.seats.forEach((seat, pos)=>{
      if (seat != null){
        seat_components[pos].playerIsSitting = egoPos > 0;
        
        seat_components[pos].player = seat;
        seat_components[pos].index = pos;
        seat_components[pos].room = this.room.id;
      }
      
    });


  }

  ngOnDestroy(): void{
    this.onRoomSubscription.unsubscribe();
    this.onError.unsubscribe();
    
  }
}
