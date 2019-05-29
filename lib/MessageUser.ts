import Message from "./Message";
import {IMessageUser} from "./IMessageUser";

export default class MessageUser extends Message {
	data: IMessageUser;

	constructor(message: IMessageUser) {
		super(message);
		this.data = message;
	}


	public getNick = (): string => this.data.nickname;
	public getFullName = (): string => this.data.fullname;
	public getEmail = (): string => this.data.email;
	public getToken = (): string => this.data.token;

	public setNick = (newName: string): void => {
		this.data.nickname = newName
	};

	public static fromJSON(arrJson: IMessageUser): MessageUser {
		return new MessageUser(arrJson);
	}
}