import { Component, Input, OnInit } from '@angular/core';
import { SimpleUIEvent, UieventService } from 'src/app/services/uievent.service';
import { Room_Client } from 'src/pots/client_data/Room_Client';

@Component({
  selector: 'app-adminwindow',
  templateUrl: './adminwindow.component.html',
  styleUrls: ['./adminwindow.component.css']
})
export class AdminwindowComponent implements OnInit {
  visible = false;

  constructor(private uiEvent: UieventService){

  }

  @Input()
  set room(r: Room_Client){
    if (!r){
      this.visible = false;
      return;
    }
    this.visible = r?.seats[r?.table?.egoPos]?.admin;
  }
  
  grant(){
    this.uiEvent.AdminAction.next(SimpleUIEvent.ADMIN_PROMOTE);
  }

  revoke(){
    this.uiEvent.AdminAction.next(SimpleUIEvent.ADMIN_REVOKE);
  }

  fold(){
    this.uiEvent.AdminAction.next(SimpleUIEvent.ADMIN_FOLD);
  }

  kick(){
    this.uiEvent.AdminAction.next(SimpleUIEvent.ADMIN_KICK);
  }

  plus(){
    this.uiEvent.AdminAction.next(SimpleUIEvent.ADMIN_PLUS);
  }

  minus(){
    this.uiEvent.AdminAction.next(SimpleUIEvent.ADMIN_MINUS);
  }

  bbplus(){
    this.uiEvent.AdminAction.next(SimpleUIEvent.ADMIN_BLIND_PLUS);
  }

  bbminus(){
    this.uiEvent.AdminAction.next(SimpleUIEvent.ADMIN_BLIND_MINUS);
  }




  ngOnInit(): void {
  }

}
