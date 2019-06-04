import Message        from "./Message";
import {IMessageUser} from "./models/IMessageUser";

export default class MessageUser extends Message
{
    data: IMessageUser;
    getNick: () => string;
    getFullName: () => string;
    getEmail: () => string;
    getToken: () => string;
    setNick: (newName: string) => void;

    constructor(message: IMessageUser);

    static fromJSON(arrJson: IMessageUser): MessageUser;
}
