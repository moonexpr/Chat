import { IMessage } from './IMessage';
export default class Message {
    data: IMessage;
    constructor(message: IMessage);
    getContent: () => string;
    static fromJSON(arrJson: IMessage): Message;
}
