import {MessageType} from "./MessageType";
import {IMessageInstruction} from "./IMessageInstruction";

export interface IMessage {
	type: MessageType,
	content: string;
	instruction?: IMessageInstruction;
}