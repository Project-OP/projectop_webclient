import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, resolveForwardRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MsgdialogComponent } from 'src/app/components/msgdialog/msgdialog.component';
import { ClientapiService } from 'src/app/services/clientapi.service';
import { ClientError } from 'src/pots/client_data/ClientError';
import { New_Room_Resp } from 'src/pots/client_data/New_Room_Resp';
import { Room_Client } from 'src/pots/client_data/Room_Client';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  @ViewChild('msgbox') 
  msgbox: MsgdialogComponent; 

  join = false;

  form = new FormGroup({

    newjoin: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z0-9 ]+')]),
    roomid: new FormControl('')
 
  });

  get name(): AbstractControl | null
  { 
     return this.form.get('name'); 
  }

  
  constructor(
        @Inject(DOCUMENT) private document: Document,
        private api: ClientapiService,
        private router: Router
  ) { 

    
  }

  ngOnInit(){
    this.form.get("newjoin")?.setValue("new");
    this.form.get("newjoin")?.valueChanges.subscribe(x => {
      this.join = x == "join";
    })
  }
  ngAfterViewInit(){
    this.document.body.classList.remove('table_background');
    this.document.body.classList.add('lobby_background');
     
  }



 async submit(){

    if (this.form.invalid){
      return;
    }
    const name = this.form.get("name")?.value;
    const roomid = this.form.get("roomid")?.value;
    if (this.join){
      const resp = await this.api.Join(name, roomid);
      if (resp instanceof ClientError){
        const error: ClientError = resp;
        if (error.reason == "You are already in this room"){
          const resp = await this.api.Enter(roomid);
          this.router.navigate(['/table',roomid]);
        }else{
          this.msgbox.setError(error);
        }
        
      }else{
        const theroom: Room_Client = resp;
        this.router.navigate(['/table',theroom.id]);
      }

    }else{
      const resp = await this.api.NewGame(name);
      if (resp instanceof ClientError){
        const error: ClientError = resp;
        this.msgbox.setError(error);
      }else{
        const roominfo: New_Room_Resp = resp;
        const id = roominfo.id;
        const room = await this.api.Enter(id);
        if (room instanceof ClientError){
          const error: ClientError = room;
          this.msgbox.setError(error);
        }else{
          const theroom: Room_Client = room;
          this.router.navigate(['/table',theroom.id]);
        }
      }

    }
 }

}
