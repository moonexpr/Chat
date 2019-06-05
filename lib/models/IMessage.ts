import {MessageType}         from "../MessageType";
import {IMessageInstruction} from "./IMessageInstruction";

/**
 * Used for system announcements and administrative messages.
 */
export interface IMessage
{
    type: MessageType,
    timestamp: Date,
    content: string;
    instruction?: IMessageInstruction;
}
