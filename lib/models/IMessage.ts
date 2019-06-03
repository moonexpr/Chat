import {MessageType} from "../MessageType";
import {IMessageInstruction} from "./IMessageInstruction";

export interface IMessage {
	type: MessageType,
	timestamp: Date,
	content: string;
	instruction?: IMessageInstruction;
}