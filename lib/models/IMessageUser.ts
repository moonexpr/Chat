import {IMessage} from './IMessage';

export interface IMessageUser extends IMessage {
	identity: Identity;
	nickname: string;
	token: string;
}