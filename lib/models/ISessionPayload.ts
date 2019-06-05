import {Session}      from "../Session";
import {IMessageUser} from "./IMessageUser";

/**
 * Data structure used to keep track of both a client's
 * message and their session.
 */
export default interface ISessionPayload
{
    session: Session;
    payload: IMessageUser;
}
