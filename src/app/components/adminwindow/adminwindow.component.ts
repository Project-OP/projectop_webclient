import { Component, Input, OnInit } from '@angular/core';
import { Room_Client } from 'src/pots/client_data/Room_Client';

@Component({
  selector: 'app-adminwindow',
  templateUrl: './adminwindow.component.html',
  styleUrls: ['./adminwindow.component.css']
})
export class AdminwindowComponent implements OnInit {

  @Input()
  set room(r: Room_Client){
    if (!r){
      this.visible = false;
      return;
    }
    this.visible = r?.seats[r?.table?.egoPos]?.admin;
  }
  


  visible = false;
  constructor() { }

  ngOnInit(): void {
  }

}
