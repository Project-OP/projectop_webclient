import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  join = false;
  form = new FormGroup({
    newjoin: new FormControl(''),
    name: new FormControl(''),
    roomid: new FormControl('')
  });
  
  constructor(
        @Inject(DOCUMENT) private document: Document
  ) { 

    this.form.get("newjoin")?.setValue("new");
   this.form.get("newjoin")?.valueChanges.subscribe(x => {
    this.join = x == "join";
   })
  }

  ngOnInit(){

  }
  ngAfterViewInit(){
    this.document.body.classList.remove('table_background');
    this.document.body.classList.add('lobby_background');
     
  }

  onRadioChange(value: string){
    console.log(" Value is : ", value );
 }

 submit(){
   console.log(this.form);
 }

}
