import Message from "./Message";
import { IMessageUser } from "./models/IMessageUser";
export default class MessageUser extends Message {
    data: IMessageUser;
    constructor(message: IMessageUser);
    getNick: () => string;
    getFullName: () => string;
    getEmail: () => string;
    getToken: () => string;
    setNick: (newName: string) => void;
    static fromJSON(arrJson: IMessageUser): MessageUser;
}
