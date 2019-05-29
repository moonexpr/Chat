import {IMessage} from './IMessage';

export default class Message {

	data: IMessage;

	constructor(message: IMessage) {
		this.data = message;
	}

	public getContent = (): string => this.data.content;

	public static fromJSON(arrJson: IMessage) {
		return new Message(arrJson);
	}
}