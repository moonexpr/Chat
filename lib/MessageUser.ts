import Message from "./Message";

export default class MessageUser extends Message {
	data: IMessageUser;

	constructor(message: IMessageUser) {
		super(message);
		this.data = message;
	}


	public getNick = (): string => this.data.nickname;
	public getFullName = (): string => this.data.fullname;
	public getEmail = (): string => this.data.email;

	public setNick = (newName: string): void => {
		this.data.nickname = newName
	};

	public static fromJSON(arrJson: IMessageUser): MessageUser {
		return new MessageUser(arrJson);
	}
}