import { Card_Client } from "./Card_Client";
import { Hand_Client } from "./Hand_Client";
import { RoundTurn } from "./RoundTurn";

export class Player_Client{
    Name: string;
    Balance: number;
    CardsCount: number;
    Cards: Array<Card_Client> = [];
    you: boolean;
    roundturn: RoundTurn;
    empty: boolean;
    hand: Hand_Client;
    admin = false;
    win = 0;

    static Empty(){
        return new Player_Client();
    }

    constructor(){
        this.Name = "";
        this.Balance = 0;
        this.CardsCount= 0;
        this.you=false;
        this.roundturn=new RoundTurn();
        this.empty = true;
        this.hand=new Hand_Client();
    }

    
}