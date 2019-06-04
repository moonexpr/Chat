import {Session}      from "../Session";
import {IMessageUser} from "./IMessageUser";

export default interface ISessionPayload
{
    session: Session;
    payload: IMessageUser;
}
