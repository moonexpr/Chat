import Message from "./Message";
import {IMessageUser} from "./IMessageUser";
import {MessageType} from "./MessageType";

export default class MessageUser extends Message implements IMessageUser {
	email: string;
	fullname: string;
	nickname: string;
	token: string;

	constructor(msg: IMessageUser) {
		super(msg);

		this.email = msg.email;
		this.fullname = msg.fullname;
		this.nickname = msg.nickname;
		this.token = msg.token;

		this.type = MessageType.UGC;
	}

	public getNick = (): string => this.nickname;
	public getFullName = (): string => this.fullname;
	public getEmail = (): string => this.email;
	public getToken = (): string => this.token;

	public setNick = (newName: string): void => {
		this.nickname = newName
	};

	public static fromJSON(msg: IMessageUser) {
		return new MessageUser(msg);
	}
}