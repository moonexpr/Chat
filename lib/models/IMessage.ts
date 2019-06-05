import {MessageType}         from "../MessageType";
import {IMessageInstruction} from "./IMessageInstruction";

/**
 * Base skeleton message used for all messages, targeted for system announcements.
 */
export interface IMessage
{
    type: MessageType,
    timestamp: Date,
    content: string;
    instruction?: IMessageInstruction;
}
