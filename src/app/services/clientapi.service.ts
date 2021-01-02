import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientError} from 'src/pots/client_data/ClientError';
import { New_Room_Resp } from 'src/pots/client_data/New_Room_Resp';
import { Room_Client } from 'src/pots/client_data/Room_Client';

@Injectable({
  providedIn: 'root'
})
export class ClientapiService {

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
      return e;
    }catch(er){
      return this.toJsonError(er);
    }
  }

  public async Enter(roomid: string): Promise<Room_Client |ClientError>{
    try{
      const e = await this.http.get<Room_Client>("/game/id/"+roomid, {responseType:'json'}).toPromise();
      return e;
    }catch(er){
      return this.toJsonError(er);
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
