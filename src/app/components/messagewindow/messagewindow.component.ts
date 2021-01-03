import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-messagewindow',
  templateUrl: './messagewindow.component.html',
  styleUrls: ['./messagewindow.component.css']
})
export class MessagewindowComponent implements OnInit {

  @Input()
  msg: string;

  @Input()
  set msgnum(n: number){
    if (!this.msg){
      return;
    }
    if (n > this._msgnum){
      this._msgnum = n;

      if (this.msgs.length > 30){
        this.msgs.shift();
      }
      this.msgs.push(this.msg);
    }
    
  }

  @ViewChild('scroll') private scrollable: ElementRef;


  _msgnum: number = -1;
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
