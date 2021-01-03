import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientError} from 'src/pots/client_data/ClientError';
import { MyRoom } from 'src/pots/client_data/MyRoom';
import { New_Room_Resp } from 'src/pots/client_data/New_Room_Resp';
import { Room_Client } from 'src/pots/client_data/Room_Client';

@Injectable({
  providedIn: 'root'
})
export class ClientapiService {

  room: Room_Client;

  OnRoomData = new EventEmitter<string>();
  OnApiError = new EventEmitter<ClientError>();


  constructor(private http: HttpClient) {

   }


  
  public async NewGame(name: string): Promise<New_Room_Resp |ClientError >{
    try{
     const e = await this.http.get<New_Room_Resp>("/game/new/"+name, {responseType:'json'}).toPromise();     
     
      return e;
    }catch(er){
      return this.toJsonError(er);
    }
     
  }
  public async Join(name: string, roomid: string): Promise<Room_Client |ClientError>{
    try{
      const e = await this.http.get<Room_Client>("/game/id/"+roomid+"/join/"+name, {responseType:'json'}).toPromise();
      this.room = e;
      this.OnRoomData.emit("sit");

      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
    }
  }

  public async StartGame(): Promise<Room_Client |ClientError>{
    try{
      const e = await this.http.get<Room_Client>("/game/id/"+this.room.id+"/startgame", {responseType:'json'}).toPromise();
      this.room = e;
      this.OnRoomData.emit("sit");

      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
    }
  }

  public async NewRound(): Promise<Room_Client |ClientError>{
    try{
      
      const e = await this.http.get<Room_Client>(`/game/id/${this.room.id}/startgame`, {responseType:'json'}).toPromise();
      this.room = e;
      this.OnRoomData.emit("new round");

      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
    }
  }

  public async Turn(amount: number): Promise<Room_Client |ClientError>{
    try{
      let a = "set";
      if (amount == -1){
        a = "fold"
      }
      const e = await this.http.get<Room_Client>(`/game/id/${this.room.id}/turn/${a}/${amount}`, {responseType:'json'}).toPromise();
      this.room = e;
      this.OnRoomData.emit("sit");

      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
    }
  }

  public async Sitout(back = false): Promise<Room_Client |ClientError>{
    try{
      
      const e = await this.http.get<Room_Client>(`/game/id/${this.room.id}/sitout/${back}/`, {responseType:'json'}).toPromise();
      this.room = e;
      this.OnRoomData.emit("sitout "+back);

      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
    }
  }


  public async Refresh(): Promise<Room_Client |ClientError>{
    try{
      const e = await this.http.get<Room_Client>(`/game/id/${this.room.id}/refresh`, {responseType:'json'}).toPromise();
      this.room = e;
      this.OnRoomData.emit("update");

      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
    }
  }

/*
  console.log("ADMIN: force fold");
  ADMIN: kick player
  ADMIN: revoke admin rights
  ADMIN: grant admin rights
  get +-money
  
  */
  
  public async Admin_Fold(): Promise<Room_Client |ClientError>{
    try{
      const e = await this.http.get<Room_Client>(`/game/id/${this.room.id}/admin/fold`, {responseType:'json'}).toPromise();
      this.room = e;
      this.OnRoomData.emit("admin fold");
      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
    }
  }
  public async Admin_Kick(): Promise<Room_Client |ClientError>{
    try{
      const e = await this.http.get<Room_Client>(`/game/id/${this.room.id}/admin/kick`, {responseType:'json'}).toPromise();
      this.room = e;
      this.OnRoomData.emit("admin kick");
      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
    }
  }
  public async Admin_Promote(): Promise<Room_Client |ClientError>{
    try{
      const e = await this.http.get<Room_Client>(`/game/id/${this.room.id}/admin/promote/all`, {responseType:'json'}).toPromise();
      this.room = e;
      this.OnRoomData.emit("admin promote");
      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
    }
  }
  public async Admin_Revoke(): Promise<Room_Client |ClientError>{
    try{
      const e = await this.http.get<Room_Client>(`/game/id/${this.room.id}/admin/revoke/all`, {responseType:'json'}).toPromise();
      this.room = e;
      this.OnRoomData.emit("admin revoke");
      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
    }
  }
  public async Admin_SetAmount(amount:number): Promise<Room_Client |ClientError>{
    try{
      const e = await this.http.get<Room_Client>(`/game/id/${this.room.id}/admin/set/${amount}`, {responseType:'json'}).toPromise();
      this.room = e;
      this.OnRoomData.emit("admin set amount");
      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
    }
  }

  public async GetMyRoom(): Promise<MyRoom |ClientError>{
    try{
      const e = await this.http.get<MyRoom>("/game/myroom/", {responseType:'json'}).toPromise();

      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
    }
  }



  public async Sit(pos: number): Promise<Room_Client |ClientError>{
    try{
      const e = await this.http.get<Room_Client>(`/game/id/${this.room.id}/sit/${pos}`, {responseType:'json'}).toPromise();
      this.room = e;
      
      this.OnRoomData.emit("sit");
      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
      
    }
  }

  
  public async Leave(): Promise<Room_Client |ClientError>{
    try{
      const e = await this.http.get<Room_Client>(`/game/id/${this.room.id}/leave`, {responseType:'json'}).toPromise();
      this.room = e;
      
      this.OnRoomData.emit("leave");
      return e;
    }catch(er){
      const ret = this.toJsonError(er);
      this.OnApiError.emit(ret);
      return ret;
      
    }
  }
  

  public async Enter(roomid: string): Promise<Room_Client |ClientError>{
    try{
      const e = await this.http.get<Room_Client>("/game/id/"+roomid, {responseType:'json'}).toPromise();
      this.room = e;

      return e;
    }catch(er){
      return this.toJsonError(er);
    }
  }

  public NotifyTurn(): void{
    try{
      this.http.get(`/game/id/${this.room.id}/notifyactive/`).toPromise();
    }catch(er){
      //nop
    }
  }


 private toJsonError(er: HttpErrorResponse): ClientError
 {
  
  if (er.status == 504){
    return new ClientError("cannot start game" , 'server unreachable');
  }else if (er.status == 500){
    const apierror: ClientError = er.error;
    return new ClientError(apierror.error, apierror.reason);
  }else{
    console.log("unknow error",er);
    return new ClientError("unknow error",er.error);
  }
 }

  public async Test(){
    //const e = await this.http.get("/game/new/phil").toPromise();
    //console.log(e);
    console.log("IT WORKS");
    return "it works";
  }
}
