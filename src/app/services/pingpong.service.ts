import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Observer } from 'rxjs';
import { Observable } from 'rxjs';
import { ClientapiService } from './clientapi.service';

@Injectable({
  providedIn: 'root'
})
export class PingpongService {

  constructor(private api: ClientapiService, private router: Router) {
    this.checkPongPeriodically();

  }
  ws: WebSocket;

  fallback = false;
  connectionOnceEstablished = false;

  private lastPongRecv = 0;
  public _wsMessages: Subject<string>;

  get wsMessages(){
    if (!this._wsMessages){
      this._wsMessages = new Subject();
    }
    return this._wsMessages;
  }
  
  


  public _wsConnection: Subject<number>;
  get wsConnection(){
    if (!this._wsConnection){
      this._wsConnection = new Subject();
    }
    return this._wsConnection;
  }
    

  private checkPongPeriodically(){

    // we do this if the connection was once established
    if (this.connectionOnceEstablished){
      const lastPongUpdate = Date.now() - this.lastPongRecv; //ms
      if (lastPongUpdate > 30000){
        console.log("pong not recv since 30s or more.., closing and reconnecting");
        // if we did not get any update for 30s, our connection is lost
        // we may be aware of this, if the socket is closed, so we check the socket for open, if so, it is not!, we kill the connection and reconnect
        if (this.ws.readyState == WebSocket.OPEN){
          this.ws.close();
        }
      }

    }

    setTimeout(()=>{
      this.checkPongPeriodically();
    },10000);
  }

  onopen(){
    console.log("ws connected");
    this._wsConnection.next(WebSocket.OPEN);
    this.connectionOnceEstablished = true;
  }
  onclose(){
    this._wsConnection.next(WebSocket.CLOSED);
    
    console.log("disconnected from ws, reconnecting in 30s");
    this.fallbackPolling();
    setTimeout(()=>{
      console.log("reconnecting to ws...");
      this.Connect();
    },30000);
  }
  onmessage(e: string){
    if (e == "Update"){
      this.api.Refresh();
    }
    if (e == "pong"){
      this.lastPongRecv = Date.now();
    }
    
    this.wsMessages?.next(e);
  } 
 
  onerror(){
    console.log("ws error"); 
  }

  public Connect(){
    console.log("ORIGIN",);
    const i = window.location.origin.includes("localhost");
    console.log(i);
    let wsp = "ws";
    if (window.location.protocol.includes("s")){
      wsp+="s";
    }
    let port = "";
    if (window.location.port != "" && window.location.port != "443" && window.location.port != "80"){
      port = ":3000";
    }

    this.ws = new WebSocket(`${wsp}://${window.location.hostname}${port}/heartbeat`);
    
    //
    console.log("ws connecting to",this.ws.url);
    
    this.ws.onopen = () => {this.onopen();};
    this.ws.onmessage = (e)=>{this.onmessage(e.data);};
    this.ws.onclose = () => {this.onclose();};
    this.ws.onerror = () =>  {this.onerror();};
    
    if (!this.connectionOnceEstablished){
      // we call this only once because it calls itself recursively on timeout, which never stops
      this.sendPing();
    }
  }

  sendPing(){
    if(this.ws.readyState == WebSocket.OPEN){
      this.ws.send("ping");
      

    }
    
    setTimeout(()=>{
      this.sendPing();
    },5000);
  }

  fallbackPolling(){
    this.fallback = true;
    console.log("ws connection lost, switch to fallback polling");
    setTimeout(()=>{
      this.fallback = true;
      if (this.ws.readyState != WebSocket.OPEN){
        if (this.api.room && this.api.room.id != ""){
          this.api.Refresh();
        }
        this.fallbackPolling();
      }else{
        this.fallback = false;
        return;
 
      }
    },5000);
    
  }
 
}
