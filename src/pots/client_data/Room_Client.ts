
import { Player_Client } from "./Player_Client";
import { Hand_Client } from "./Hand_Client";
import { Card_Client } from "./Card_Client";
import { Table } from "../data/Table";


export class Room_Client{

    id = "";
    table: Table = new Table();
    update_notification: string = "";
    update_notification_id: number = 0;
    seats: Array<Player_Client> = [];
    msg = "";
    msg_cnt = -1;
    constructor(){


       
        
        
    }
}