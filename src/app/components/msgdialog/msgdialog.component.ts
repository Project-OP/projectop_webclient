import { Component, OnInit } from '@angular/core';
import { ClientError } from 'src/pots/client_data/ClientError';

@Component({
  selector: 'app-msgdialog',
  templateUrl: './msgdialog.component.html',
  styleUrls: ['./msgdialog.component.css']
})
export class MsgdialogComponent implements OnInit {

  visible = false;
  error = false;
  head= "Example header";
  msg = "This is an example message";
  
  constructor() { }
  
  setMessage(head: string, body: string, error: boolean = false){
    this.error = error;
    this.visible = true;
    this.head = head;
    this.msg = body;
  }

  setError(er: ClientError){
    this.setMessage(er.error,er.reason,true);
  }
  
  
  ok(){
    this.visible = false;
  }

  ngOnInit(): void {
  }

}
