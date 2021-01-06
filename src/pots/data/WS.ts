import ReconnectingWebSocket from "reconnecting-websocket";

export class WS{

    private static check(ws: WebSocket){
        if (!ws){
            throw new Error("ws is null");
        }
        if (ws.readyState != WebSocket.OPEN){
            throw new WSReadyStateError("send", ws);
        }
        
    }
    private static checkcb(o: any, readyState: number){
        if (!o){
            throw new Error("ws is null");
        }
        if (readyState != WebSocket.OPEN){
            throw new WSReadyStateError("send", null, readyState);
        }
        
    }
    public static async Send(ws: WebSocket, type: WSType, body = ""): Promise<void>{
        WS.check(ws);
        ws.send(JSON.stringify(new WSJsonMsg(type.code, body)));
    }
    public static async SendRWS(r: ReconnectingWebSocket, type: WSType, body = ""): Promise<void>{
        this.checkcb(r,r.readyState);
        r.send(JSON.stringify(new WSJsonMsg(type.code, body)));
    }

    public static async SendJSON(ws: WebSocket, json: WSJsonMsg): Promise<void>{
        WS.check(ws);
        ws.send(JSON.stringify(json));
    }

    public static async Recv(msg: string): Promise<WSJsonMsg>{
        const parsed = JSON.parse(msg);
        const ret: WSJsonMsg = parsed;
        return ret;
    }

}

export class WSJsonMsg{
    constructor(public type: string, public body = ""){}
}

export class WSReadyStateError extends Error{
    readyState = WebSocket.CLOSED;

    constructor(operation: string, private ws: WebSocket|null = null,readyState = 0){
        super("Error ws operation: "+operation+ ", readystate: "+ (ws ? ws.readyState: readyState));
        this.readyState = (ws ? ws.readyState: readyState);
    }
}
export class WSType{
    code = "ERROR";
    public static MSG = new WSType("MSG");
    public static ERROR = new WSType("ERROR");
    public static PING = new WSType("PING");
    public static PONG = new WSType("PONG");
    public static UPDATE = new WSType("UPDATE");
    public static HELLO = new WSType("HELLO");
    public static NUDGE = new WSType("NUDGE");

    constructor(type: string){
        this.code = type;
    }   
}
