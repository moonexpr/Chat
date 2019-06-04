import {Instruction} from "../Instruction";
import {MessageType} from "../MessageType";

export default interface IClientPayload
{
    type: MessageType,
    content: string,
    token: string,
    instruction?: Instruction,
}
