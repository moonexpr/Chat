import Message from "./Message";
import {IMessageUser} from "./models/IMessageUser";
import {MessageType} from "./MessageType";

export default class MessageUser extends Message implements IMessageUser {
	identity: Identity;
	token: string;
	nickname: string;

	constructor(id: Identity, msg: IMessageUser) {
		super(msg);

		this.identity = id;
		this.token = msg.token;
		this.type = MessageType.UGC;

		this.nickname = this.identity.firstname;
	}

	public getNick = (): string => this.nickname;

	public getIdentity = (): Identity => this.identity;
	public getToken = (): string => this.token;

	public setNick = (newName: string): void => {
		this.nickname = newName
	};
}