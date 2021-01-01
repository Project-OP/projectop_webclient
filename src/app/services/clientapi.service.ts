import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientapiService {

  constructor(private http: HttpClient) {

   }

  public async Test(){
    //const e = await this.http.get("/game/new/phil").toPromise();
    //console.log(e);
    console.log("IT WORKS");
    return "it works";
  }
}
