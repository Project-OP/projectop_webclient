import { Component, HostListener, OnInit } from '@angular/core';
import { ClientapiService } from 'src/app/services/clientapi.service';
import { HotkeyService } from 'src/app/services/hotkey.service';

@Component({
  selector: 'app-turnactions',
  templateUrl: './turnactions.component.html',
  styleUrls: ['./turnactions.component.css']
})
export class TurnactionsComponent implements OnInit {

  visible = true;

  constructor(private hotkeys: HotkeyService, private api: ClientapiService) {}

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) {
      

      let shift = "";
      if (event.shiftKey){
        shift = "shift.";
      }
      let n = shift+event.key;
      switch(n){
          case "h":
            this.visible = !this.visible;
          break;

      }

    }
  ngOnInit() {
  
  }

}
