import {IMessage} from './IMessage';
import {IMessageInstruction} from "./IMessageInstruction";
import {MessageType} from "./MessageType";

export default class Message implements IMessage {
	content: string;
	type: MessageType;
	instruction?: IMessageInstruction;

	constructor(msg: IMessage) {
		this.content = msg.content;
		this.type = msg.type;

		if (msg.instruction != undefined) {
			this.instruction = msg.instruction;
		}
	}

	public getContent = (): string => this.content;

	public static fromJSON(msg: IMessage) {
		return new Message(msg);
	}
}