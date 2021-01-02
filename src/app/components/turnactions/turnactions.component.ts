import { Component, OnInit } from '@angular/core';
import { HotkeyService } from 'src/app/services/hotkey.service';

@Component({
  selector: 'app-turnactions',
  templateUrl: './turnactions.component.html',
  styleUrls: ['./turnactions.component.css']
})
export class TurnactionsComponent implements OnInit {

  visible = true;

  constructor(private hotkeys: HotkeyService) {}

  ngOnInit() {
    
    
    this.hotkeys.addShortcut({ keys: 'h' }).pipe().subscribe(()=>{
      this.visible = !this.visible;
    });


    // admin commands
    
    this.hotkeys.addShortcut({ keys: 'shift.f' }).pipe().subscribe(()=>{
      console.log("ADMIN: force fold");
    });
    
    this.hotkeys.addShortcut({ keys: 'shift.r' }).pipe().subscribe(()=>{
      console.log("ADMIN: revoke admin rights");
    });
    this.hotkeys.addShortcut({ keys: 'shift.g' }).pipe().subscribe(()=>{
      console.log("ADMIN: grant admin rights");
    });
    this.hotkeys.addShortcut({ keys: 'shift.k' }).pipe().subscribe(()=>{
      console.log("ADMIN: kick player");
    });




    
    //this.hotkeys.addShortcut({ keys: 'meta.j' }).subscribe();
  }

}
