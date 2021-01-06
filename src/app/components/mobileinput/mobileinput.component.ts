import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SimpleUIEvent, TurnAction, UieventService } from 'src/app/services/uievent.service';

@Component({
  selector: 'app-mobileinput',
  templateUrl: './mobileinput.component.html',
  styleUrls: ['./mobileinput.component.css']
})
export class MobileinputComponent implements OnInit {

  visible = false;
  sublbl = "";
  constructor(
    private uiEvent: UieventService
  ) { 
    uiEvent.TurnActionLabelChange.subscribe((s)=>{
      this.sublbl = s;
    });
  }

  @Output()
  showhidemenu = new EventEmitter<boolean>();

  ngOnInit(): void {
  }


  onVisibleChange() {
    this.showhidemenu.emit(this.visible);
    if (this.visible){
      this.uiEvent.SimpleEvent.next(SimpleUIEvent.SHOW_SHORTCUTS);

    }
    if (!this.visible){
      this.uiEvent.SimpleEvent.next(SimpleUIEvent.HIDE_SHORTCUTS);

    }
  }
  submit(){
    this.uiEvent.TurnAction.next(TurnAction.SUBMIT);
  }
  raise(){
    this.uiEvent.TurnAction.next(TurnAction.RAISE.amount(1));
  }
  lower(){
    this.uiEvent.TurnAction.next(TurnAction.RAISE.amount(-1));
  }
  fold(){
    this.uiEvent.TurnAction.next(TurnAction.FOLD);
  }
  allin(){
    this.uiEvent.TurnAction.next(TurnAction.ALLIN);
  }
  nudge(){
    this.uiEvent.SimpleEvent.next(SimpleUIEvent.NUDGE);
  }
  scaling(){
    this.uiEvent.SimpleEvent.next(SimpleUIEvent.TOGGLE_VIEWPORTSCALING);

  }

}
