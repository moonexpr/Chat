import {IMessage} from './IMessage';

export interface IMessageUser extends IMessage {
	nickname: string;
	fullname: string;
	email: string;
	token: string;
}