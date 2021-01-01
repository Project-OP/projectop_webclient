import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SeatComponent } from 'src/app/components/seat/seat.component';
import { ClientapiService } from 'src/app/services/clientapi.service';
import { Player_Client } from 'src/pots/client_data/Player_Client';
import { Room_Client } from 'src/pots/client_data/Room_Client';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  
  public seatcount = 8;

  @ViewChildren('seats') 
  seats_elem: QueryList<SeatComponent>;

  @ViewChild('table') 
  table: ElementRef;

  seats: Array<Player_Client>;
  room: Room_Client;
  constructor(
    private api: ClientapiService,
    @Inject(DOCUMENT) private document: Document
    ) 
    {
      const seats_init: Array<Player_Client> = [];
      for (let i = 0; i < 8; i++){
        seats_init.push(Player_Client.Empty());
      }
      
      this.seats = seats_init;
      this.seats_elem = new QueryList<SeatComponent>();
      this.room = new Room_Client();
    }
    


  ngOnInit(): void {
    this.api.Test();
  }

  ngAfterViewInit(){
    this.document.body.classList.add('table_background');
    console.log(this.seats_elem.toArray());
    const table_dom = this.table.nativeElement;
    console.log(table_dom.offsetWidth, table_dom.offsetHeight );
     
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: string) {
    const table_dom = this.table.nativeElement;
    console.log(table_dom.offsetWidth, table_dom.offsetHeight );
  }
}
