import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { SeatComponent } from 'src/app/components/seat/seat.component';
import { ClientapiService } from 'src/app/services/clientapi.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {


  seats: SeatComponent[];

  constructor(
    private api: ClientapiService,
    @Inject(DOCUMENT) private document: Document
    ) 
    {
      this.seats = new Array<SeatComponent>();
      for(let i = 0; i < 1; i++ ){
        this.seats.push(new SeatComponent());
      }
    }
    


  ngOnInit(): void {
    this.api.Test();
  }

  ngAfterViewInit(){
    this.document.body.classList.add('table_background');
  }
}
