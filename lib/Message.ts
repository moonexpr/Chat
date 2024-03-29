import {MessageType}         from "./MessageType";
import {IMessage}            from './models/IMessage';
import {IMessageInstruction} from "./models/IMessageInstruction";

/**
 * Server-side interface of a basic message
 */
export default class Message implements IMessage
{
    timestamp: Date;
    content: string;
    type: MessageType;
    instruction?: IMessageInstruction;

    constructor(msg: IMessage)
    {
        this.content = msg.content;
        this.type = msg.type;
        this.timestamp = msg.timestamp;
        this.type = MessageType.Host;

        if (msg.instruction != undefined)
        {
            this.instruction = msg.instruction;
        }
    }
}
