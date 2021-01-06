import { ClientError } from "./client_data/ClientError";

export class ErrorInfo{
    public static NOT_YOUR_TURN = new ErrorInfo();
    public static NOT_ENOUGH_PLAYER = new ErrorInfo();
    public static GENERIC = new ErrorInfo();

    public static UNKNOWN = new ErrorInfo();

    public static GetErrorInfo(e: ClientError): ErrorInfo{
        if (!e || !e.reason){
            return this.UNKNOWN;
        }
        if (e.reason.includes("turn")){
            return this.NOT_YOUR_TURN;
        }
        
        if (e.reason.trim() == "must be at least 2 players"){
            return this.NOT_ENOUGH_PLAYER;
        }
        if (e.reason.includes("unknown error") ||e.error.includes("unknown error")){
            return this.UNKNOWN;
        }
        return this.GENERIC;

    }
    private constructor(){

    }

}