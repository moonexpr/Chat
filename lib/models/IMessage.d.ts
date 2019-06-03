import { MessageType } from "../MessageType";
export interface IMessage {
    type: MessageType;
    content: string;
}
