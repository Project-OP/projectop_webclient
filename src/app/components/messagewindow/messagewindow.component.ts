import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-messagewindow',
  templateUrl: './messagewindow.component.html',
  styleUrls: ['./messagewindow.component.css']
})
export class MessagewindowComponent implements OnInit {

  @Input()
  set msg(m: string){

    if (m == null){
      return;
    }
    
    console.log("recv",m);
    let time = new Date();
    const hhmm = ("0" + time.getHours()).slice(-2)   + ":" + ("0" + time.getMinutes()).slice(-2);
    const hhmmms = hhmm + "> "+m;
    
    if (this.msgs.length > 30){
      this.msgs.shift();
    }
    this._msg = m;
    this.msgs.push(hhmmms);


  }
  _msg: string;

  @Input()
  msgnum: number
    
    
  

  @ViewChild('scroll') private scrollable: ElementRef;


  msgs: string[] = [];
  
  constructor() { }


  ngOnInit() { 
      this.scrollToBottom();
  }

  ngAfterViewChecked() {        
      this.scrollToBottom();        
  } 

  scrollToBottom(): void {
      try {
          this.scrollable.nativeElement.scrollTop = this.scrollable.nativeElement.scrollHeight;
      } catch(err) { }        
  }  

 
}
