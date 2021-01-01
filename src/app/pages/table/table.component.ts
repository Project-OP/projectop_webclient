import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ClientapiService } from 'src/app/services/clientapi.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {



  constructor(
    private api: ClientapiService,
    @Inject(DOCUMENT) private document: Document
    ) 
    {

    }
    


  ngOnInit(): void {
    this.api.Test();
  }

  ngAfterViewInit(){
    this.document.body.classList.add('table_background');
  }
}
