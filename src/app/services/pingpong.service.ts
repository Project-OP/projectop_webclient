import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer, Subject } from 'rx';
import { ClientapiService } from './clientapi.service';

@Injectable({
  providedIn: 'root'
})
export class PingpongService {

  constructor(private api: ClientapiService, private router: Router) { }
  ws: WebSocket;

  onopen(){
    console.log("ws connected");

  }
  onclose(){
    console.log("disconnected from ws, reconnecting in 30s");
    setTimeout(()=>{
      console.log("reconnecting to ws...");
      this.Connect();
    },30000);
  }
  onmessage(e: string){
    if (e == "Update"){
      this.api.Refresh();
    }
  }

  onerror(){
    console.log("ws error"); 
  }

  public Connect(){
    if (this.router.url.indexOf("localhost")){
      
      this.ws = new WebSocket("ws://localhost:3000/heartbeat");

    }else{
      this.ws = new WebSocket("wss://projectop.philipphock.rocks/heartbeat");
    }
    //
    console.log("ws connecting to",this.ws.url);
    
    this.ws.onopen = this.onopen;
    this.ws.onmessage = (e)=>{this.onmessage(e.data);};
    this.ws.onclose = this.onclose;
    this.ws.onerror = this.onerror;
   
    this.sendPing();
  }

  sendPing(){
    if(this.ws.readyState == WebSocket.OPEN){
      this.ws.send("ping");
    }
    setTimeout(()=>{
      this.sendPing();
    },5000);
  
  }
 
}
