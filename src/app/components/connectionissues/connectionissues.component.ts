import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClientapiService } from 'src/app/services/clientapi.service';
import { PingpongService } from 'src/app/services/pingpong.service';

@Component({
  selector: 'app-connectionissues',
  templateUrl: './connectionissues.component.html',
  styleUrls: ['./connectionissues.component.css']
})
export class ConnectionissuesComponent implements OnInit {

  constructor(
    private  srv: PingpongService,
    private  api: ClientapiService
  ){

    
  }

  visible = true;

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) {
    if (this.visible){
      if (event.key == "r"){
        this.api.Refresh();
      }
    }
    }
    

  private subsc: Subscription
  ngOnInit(): void {
    this.visible = false;
    this.subsc = this.srv.wsConnection.subscribe((readystate: number)=>{
      this.visible = readystate != WebSocket.OPEN;
      if (readystate == WebSocket.OPEN){
        this.api.Refresh();
      }
    });
    setTimeout(()=>{
      if (this.srv.ws.readyState != WebSocket.OPEN || this.srv.ws.readyState != WebSocket.CONNECTING ){
        this.visible = true;
      }
      if (this.srv.ws.readyState == WebSocket.OPEN  ){
        this.visible = false;
      }
      
    },5000);
    
  }



}
