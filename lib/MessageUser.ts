import Message                    from "./Message";
import {MessageType}              from "./MessageType";
import IClientPayload             from "./models/IClientPayload";
import {IMessageUser}             from "./models/IMessageUser";
import {IdentityDefault, Session} from "./Session";

export default class MessageUser extends Message implements IMessageUser
{
    identity: Identity;
    token: string;
    nickname: string;

    constructor(msg: IMessageUser)
    {
        super(msg);

        this.identity = msg.identity;
        this.token = msg.token;
        this.type = MessageType.UGC;

        this.nickname = this.identity.firstname;
    }

    public static fromNetwork(payload: IClientPayload, session: Session)
    {
        if (session.identity == null)
        {
            session.identity = IdentityDefault;
        }

        return new MessageUser({
            identity: session.identity,
            nickname: '', // will be set later, don't bother now.
            token: payload.token,
            timestamp: new Date(),
            type: MessageType.UGC,
            instruction: payload.instruction,
            content: payload.content,
        });
    }

    public getNick = (): string => this.nickname;

    public getIdentity = (): Identity => this.identity;
    public getToken = (): string => this.token;

    public setNick = (newName: string): void =>
    {
        this.nickname = newName;
    };

    public getSanitisedObject(): IMessageUser
    {
        return new MessageUser({
            timestamp: new Date(),
            type: MessageType.UGC,
            content: this.content,
            identity: this.identity,
            token: '',
            nickname: this.nickname
        });
    }
}
