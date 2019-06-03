import {Session} from "../Session";
import MessageUser from "../MessageUser";

export default interface ISessionPayload {
	session: Session;
	payload: MessageUser;
	timestamp: Date;
}