import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { WS, WSJsonMsg, WSType } from 'src/pots/data/WS';
import { ClientapiService } from './clientapi.service';
import ReconnectingWebSocket from 'reconnecting-websocket';


@Injectable({
  providedIn: 'root'
})
export class PingpongService {


  constructor(private api: ClientapiService, private router: Router) {
    this.checkPongPeriodically();
    api.OnRoomData.subscribe(()=>{
      this.roomVer = "" + this.api.room.version;
    });
  }
  roomVer = "";
  fallback = false;
  connectionOnceEstablished = false;

  rws: ReconnectingWebSocket;

  private lastPongRecv = 0;
  public _wsMessages: Subject<WSJsonMsg>;

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
      if (lastPongUpdate > 5e3 && this.rws.readyState == WebSocket.OPEN){

        this.connectionOnceEstablished = false;
  
        console.log("pong not recv since 5s or more.., closing and reconnecting");
        // if we did not get any update for 30s, our connection is lost
        // we may be aware of this, if the socket is closed, so we check the socket for open, if so, it is not!, we kill the connection and reconnect
        this.rws.reconnect();
        
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
    console.log("disconnected from ws");
    this.connectionOnceEstablished = false;
    this.fallbackPolling();
  }
  async onmessage(e: string){
    const msg: WSJsonMsg = await WS.Recv(e);
    if (msg.type == WSType.UPDATE.code){
      this.api.Refresh();
    }
    if (msg.type  == WSType.PONG.code){
      if (this.roomVer != msg.body){
        if (msg.body == "-1"){
          console.log("room ver not propery recv");
        }
        console.log("pong recv, room version outdate, refreshing...", msg.body);
        this.api.Refresh();
      }
      this.roomVer = msg.body;
      this.lastPongRecv = Date.now();
    }
    
    this.wsMessages?.next(msg);
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

    const addr = `${wsp}://${window.location.hostname}${port}/heartbeat`;

    this.rws = new ReconnectingWebSocket(addr);
 

    //addEventListener(type: 'open' | 'close' | 'message' | 'error', listener: EventListener)

  const options = {
    //WebSocket?: any; // WebSocket constructor, if none provided, defaults to global WebSocket
    maxReconnectionDelay: 5000, // max delay in ms between reconnections
    minReconnectionDelay: 1000, // min delay in ms between reconnections
    reconnectionDelayGrowFactor: 1.01, // how fast the reconnection delay grows
    //minUptime?: number; // min time in ms to consider connection as stable
    connectionTimeout: 0.5, // retry connect if not connected after this time, in ms
    maxRetries: 500, // maximum number of retries
    maxEnqueuedMessages: 2, // maximum number of messages to buffer until reconnection
    startClosed: false, // start websocket in CLOSED state, call `.reconnect()` to connect
    //debug?: boolean; // enables debug 
  };
    this.rws.addEventListener('open', () => {
        this.onopen();
    });
    this.rws.addEventListener('close', () => {
      this.onclose();
    });
    this.rws.addEventListener('message', (event) => {
      this.onmessage(event.data);
    });
    this.rws.addEventListener('error', () => {
      this.onopen();
    });


    //
    console.log("ws connecting to",this.rws.url);
    /*
    this.ws.onopen = () => {this.onopen();};
    this.ws.onmessage = (e)=>{this.onmessage(e.data);};
    this.ws.onclose = () => {this.onclose();};
    this.ws.onerror = () =>  {this.onerror();};
    */
    if (!this.connectionOnceEstablished){
      // we call this only once because it calls itself recursively on timeout, which never stops
      this.sendPing();
    }
  }

  sendPing(){
    if(this.rws.readyState == WebSocket.OPEN){
      WS.SendRWS(this.rws, WSType.PING);      
    }
    
    setTimeout(()=>{
      this.sendPing();
    },5000);
  }

  fallbackPolling(){
    this.fallback = true;
    console.log("ws connection lost, switch to fallback polling");
    setTimeout(async ()=>{
      this.fallback = true;
      if (this.rws.readyState != WebSocket.OPEN){
        if (this.api.room && this.api.room.id != ""){
          await this.api.Refresh();
        }
        this.fallbackPolling();
      }else{
        this.fallback = false;
        return;
 
      }
    },1000);
    
  }
 
}
