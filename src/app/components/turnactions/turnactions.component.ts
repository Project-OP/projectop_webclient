import { Component, OnInit } from '@angular/core';
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

  ngOnInit() {
    
    
    this.hotkeys.addShortcut({ keys: 'h' }).pipe().subscribe(()=>{
      this.visible = !this.visible;
    });


  }

}
