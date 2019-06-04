import {IMessage} from './IMessage';

/**
 * Represents a message sent by a user.
 */
export interface IMessageUser extends IMessage
{
    identity: Identity;
    nickname: string;
    token: string;
}
