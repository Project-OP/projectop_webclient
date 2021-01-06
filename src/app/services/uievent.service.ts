import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ClientError } from 'src/pots/client_data/ClientError';
import { ClientapiService } from './clientapi.service';

@Injectable({
  providedIn: 'root'
})
export class UieventService {
  
  public TurnAction: Subject<TurnAction>          = new Subject<TurnAction>();
  public AdminAction: Subject<SimpleUIEvent>      = new Subject<SimpleUIEvent>();
  
  public SimpleEvent: Subject<SimpleUIEvent>      = new Subject<SimpleUIEvent>();
  public TurnActionLabelChange: Subject<string>   = new Subject<string>();

  public turnActionDirty = false;

  private turnActionLabel = "";
  private CallValue = 0;
  public TurnValue = 0;


  private egoPos = -1;

  constructor(private api: ClientapiService) {
    this.api.OnRoomData.subscribe((s: string)=>{
      this.api.room.seats.forEach((seat, pos)=>{
        if(seat.you){
          this.egoPos = pos;
        }
      });
      if (this.egoPos != -1){
        this.CallValue = this.api.room.table.current_min_bet - this.api.room.seats[this.egoPos].roundturn.amount;
        this.CallValue = Math.max(this.CallValue, 0); // at least 0
      }
      
    });
    
    this.SimpleEvent.subscribe((e)=>{
      if (e == SimpleUIEvent.NUDGE){
        this.api.NotifyTurn();
      }
    });

    this.AdminAction.subscribe((a)=>{
      if (a == SimpleUIEvent.ADMIN_BLIND_MINUS){
        let newBB = Number.parseInt(""+this.api.room.table.nextBBlind) - 2;
        if (newBB < 2){
          newBB = 2;
        }
        this.api.Admin_SetBB(newBB);
      }
      if (a == SimpleUIEvent.ADMIN_BLIND_PLUS){
        
        let newBB = Number.parseInt(""+this.api.room.table.nextBBlind) + 2;
        if (newBB < 2){
          newBB = 2;
        }
        this.api.Admin_SetBB(newBB);
      }
      if (a == SimpleUIEvent.ADMIN_FOLD){
        this.api.Admin_Fold();
      }
      if (a == SimpleUIEvent.ADMIN_KICK){
        this.api.Admin_Kick();

      }
      if (a == SimpleUIEvent.ADMIN_MINUS){
        let b = this.api.room.seats[this.egoPos].Balance-10;
          if (b < 0){
            b = 0;
          }
          this.api.Admin_SetAmount(b);
      }
      if (a == SimpleUIEvent.ADMIN_MM){
        let b = this.api.room.seats[this.egoPos].Balance-50;
          if (b < 0){
            b = 0;
          }
          this.api.Admin_SetAmount(b);
      }
      if (a == SimpleUIEvent.ADMIN_PLUS){
          let b = this.api.room.seats[this.egoPos].Balance+10;
          if (b < 0){
            b = 0;
          }
          this.api.Admin_SetAmount(b);
      }
      if (a == SimpleUIEvent.ADMIN_PP){
        let b = this.api.room.seats[this.egoPos].Balance+50;
          if (b < 0){
            b = 0;
          }
          this.api.Admin_SetAmount(b);
      }
      if (a == SimpleUIEvent.ADMIN_PROMOTE){
        this.api.Admin_Promote();

      }
      if (a == SimpleUIEvent.ADMIN_REVOKE){
        this.api.Admin_Revoke();

      }
    });


    this.TurnAction.subscribe((a: TurnAction)=>{
      
      if (a.action == TurnActionType.SUBMIT){

        const winner = this.api.room?.table?.winner_pos?.length > 0;
        const notactive = !this.api.room.table.active;
        if (notactive || winner){
          this.TurnAction.next(TurnAction.NEW_ROUND);
          return;
        }
        if (this.turnActionLabel == "sit out"){
          this.TurnAction.next(TurnAction.SITOUT);
          return;
        }
        if (this.turnActionLabel == ""){
          this.TurnAction.next(TurnAction.CALL);
        }

        if (this.canTurn()){
          this.turnActionDirty = false;
          this.turnActionLabel = "";
          this.api.Turn(this.TurnValue);
          this.TurnValue = 0;
          
          
        }else{
          this.api.OnApiError.next(new ClientError("cannot submit","not your turn"));
        }
        
      }
      if (a.action == TurnActionType.SET){
        this.updateTurnAction(a.getAmount);
        
      }
      if (a.action == TurnActionType.RAISE){
        const raiseby = this.api.room.table.current_bb * a.getAmount;
        this.TurnValue += raiseby;
        this.updateTurnAction(this.TurnValue);
        
      }
      if (a.action == TurnActionType.NEW_ROUND){
        this.api.NewRound();
      }
      if (a.action == TurnActionType.SITOUT){
        this.updateTurnAction(0,false,true);
        
      }
      if (a.action == TurnActionType.CALL){
        this.updateTurnAction(this.CallValue);
      }
      
      if (a.action == TurnActionType.FOLD){
        this.updateTurnAction(-1,true,false);
      }
      if (a.action == TurnActionType.ALLIN){
        this.updateTurnAction(this.api.room.seats[this.api.room.table.egoPos].Balance);
      }
      if (a.action == TurnActionType.SITOUT){
        this.turnActionLabel = "sit out";
        this.TurnActionLabelChange.next(this.turnActionLabel);
        if (this.api.room.table.player_turn != this.api.room.table.egoPos){
          const e = this.api.room.seats[this.egoPos];
          const sout = !e.roundturn.join_next_round && (e.roundturn.sitout ||e.roundturn.sitout_next_turn);
          this.api.Sitout(sout);
        }else{
          this.updateTurnAction(-1,true,true);
        }
      }
      
    });
  }

  private updateTurnAction(value: number = -1, fold=false, sitout=false){

    
    if (!this.api.room.table.active || this.api.room.table.winner_pos.length > 0){
      this.turnActionLabel = "start";   
      this.TurnActionLabelChange.next(this.turnActionLabel);
      return;
    }
    if (this.egoPos < 0 || this.api.room.table.player_turn != this.egoPos)
    {
      this.turnActionLabel = "-";   
      this.TurnActionLabelChange.next(this.turnActionLabel);
      return;
    }


    if (value < this.CallValue){
      value = this.CallValue;
    }

    if (value > this.api.room.seats[this.api.room.table.egoPos].Balance){
      value = this.api.room.seats[this.api.room.table.egoPos].Balance;
    }



    if (value == this.CallValue){
      this.turnActionLabel = "call";
    }
    if (value == 0){
      this.turnActionLabel = "check";
    }
    if (value > this.CallValue){
      this.turnActionLabel = "raise";
    }
    
    if (value == this.api.room.seats[this.api.room.table.egoPos].Balance){
      this.turnActionLabel = "all in";
    }

    

    if (fold){

      value = -1;
      this.turnActionLabel = "fold";
    }

    if (sitout){
      value = -1;
      this.turnActionLabel = "sit out";
    }
    
    this.turnActionDirty = true;
    this.TurnValue = value;
 

    
    this.TurnActionLabelChange.next(this.turnActionLabel);
    
    
  }

  private canTurn(){
    const ret = this.api.room.table.player_turn != this.egoPos;
    
    return !ret;

  }

  public emitAction(action: TurnAction, amount = 0, switch_state = false): void{
    const a = action.amount(amount);
    
    this.TurnAction.next(a);
    return;
  }
}
export class SimpleUIEvent{
  public static HIDE_SHORTCUTS = new SimpleUIEvent("HIDE_SHORTCUTS");
  public static SHOW_SHORTCUTS = new SimpleUIEvent("SHOW_SHORTCUTS");

  public static NUDGE = new SimpleUIEvent("NUDGE");
  public static TOGGLE_HOTKEYMENU = new SimpleUIEvent("TOGGLE_HOTKEYMENU");
  public static TOGGLE_VIEWPORTSCALING = new SimpleUIEvent("TOGGLE_VIEWPORTSCALING");
  public static ADMIN_PLUS = new SimpleUIEvent("A+");
  public static ADMIN_MINUS = new SimpleUIEvent("A-");
  public static ADMIN_KICK = new SimpleUIEvent("AK");
  public static ADMIN_FOLD = new SimpleUIEvent("AF");
  public static ADMIN_PP = new SimpleUIEvent("A++");
  public static ADMIN_MM = new SimpleUIEvent("A--");
  public static ADMIN_BLIND_PLUS = new SimpleUIEvent("ABB+");
  public static ADMIN_BLIND_MINUS = new SimpleUIEvent("ABB-");
  public static ADMIN_PROMOTE = new SimpleUIEvent("APROMOTE");
  public static ADMIN_REVOKE = new SimpleUIEvent("AREVOKE");

   constructor(private s: string){

   }
}
export class TurnActionType{
  public static SUBMIT = new TurnActionType("SUBMIT");

  public static CALL = new TurnActionType("CALL");
  public static SET = new TurnActionType("SET");
  public static RAISE = new TurnActionType("RAISE");
  public static FOLD = new TurnActionType("FOLD");
  public static SITOUT = new TurnActionType("SITOUT");
  public static ALLIN = new TurnActionType("ALLIN");
  public static SIT_OUT = new TurnActionType("SITOUT");
  public static NEW_ROUND = new TurnActionType("NEW_ROUND");
  
  constructor(public readonly id=""){

  }
}
export class TurnAction{

  public static get CALL(){
    return new TurnAction(TurnActionType.CALL);
  } 
  public static get SET(){
    return new TurnAction(TurnActionType.SET);
  } 
  public static get RAISE(): TurnAction{
   return new TurnAction(TurnActionType.RAISE);
  } 
  public static get FOLD(): TurnAction{
   return new TurnAction(TurnActionType.FOLD);
  } 
  public static get SITOUT(): TurnAction{
   return new TurnAction(TurnActionType.SIT_OUT);
  } 
  public static get ALLIN(): TurnAction{
   return new TurnAction(TurnActionType.ALLIN);
  } 
  public static get NEW_ROUND(): TurnAction{
    return new TurnAction(TurnActionType.NEW_ROUND);
  }
  public static get SUBMIT(): TurnAction{
    return new TurnAction(TurnActionType.SUBMIT);
  }

  private _amount = 0;
  amount(n: number = 0): TurnAction{
    this._amount = n;
    return this;
  }
  
  public get getAmount(){
    return this._amount;
  }

  constructor(public readonly action: TurnActionType){

  }

}

