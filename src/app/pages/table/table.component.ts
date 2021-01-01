import { Component, OnInit } from '@angular/core';
import { ClientapiService } from 'src/app/services/clientapi.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(
    private api: ClientapiService) {

    }


  ngOnInit(): void {
    this.api.Test();
  }

}
