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

  constructor(private api: ClientapiService, private router: Router) { }
  ws: WebSocket;

  fallback = false;
  private wsMessageObserver: Observer<string>;
  public wsMessages = new Observable((observer: Observer<string>)=>{
    this.wsMessageObserver = observer;
  });

  public _wsConnection: Subject<number>;

  get wsConnection(){
    if (!this._wsConnection){
      this._wsConnection = new Subject();
    }
    return this._wsConnection;
  }
    

  onopen(){
    console.log("ws connected");
    this._wsConnection.next(WebSocket.OPEN);
    
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
    
    this.wsMessageObserver?.next(e);
  } 
 
  onerror(){
    console.log("ws error"); 
  }

  public Connect(){
    
    const i = window.location.origin.includes("localhost");
    console.log(i);
    if (i){
      
      this.ws = new WebSocket("ws://localhost:3000/heartbeat");

    }else{
      this.ws = new WebSocket("wss://projectop.philipphock.rocks/heartbeat");
    }
    //
    console.log("ws connecting to",this.ws.url);
    
    this.ws.onopen = () => {this.onopen();};
    this.ws.onmessage = (e)=>{this.onmessage(e.data);};
    this.ws.onclose = () => {this.onclose();};
    this.ws.onerror = () =>  {this.onerror();};
    
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
