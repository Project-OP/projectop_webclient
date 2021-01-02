export class ClientError{
    public status: string = "error";
    

    constructor(public error: string, public reason: string){

    }
    
}