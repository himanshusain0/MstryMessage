import { Message } from "@/model/User";
export interface ApiResponse {
    success:Boolean;
    message:string;
    isAcceptingMessage?:boolean;
    messages?:Array<Message>
}