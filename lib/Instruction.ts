import Stack                           from "ts-data.stack";
import {IMessage}                      from "./models/IMessage";
import {IMessageInstruction, Priority} from "./models/IMessageInstruction";

/**
 * Server-side interface of an instruction
 */
export class Instruction implements IMessageInstruction
{

    static g_id = 0;

    id: number;
    payload: string | undefined;
    name: string;
    priority: Priority;
    callbacks: Stack<Function>;

    constructor(instr: IMessageInstruction)
    {
        this.id = Instruction.getInstructionId();
        this.name = instr.name;
        this.payload = instr.payload;
        this.priority = instr.priority == undefined ? Priority.Low : instr.priority;

        this.callbacks = new Stack<Function>();
    }

    static getInstructionId(): number
    {
        return Instruction.g_id++;
    }

    public getId(): number
    {
        return this.id;
    }

    public then(callback: Function)
    {
        this.callbacks.push(callback);
    }

    public resolve(msg: IMessage)
    {
        while (!this.callbacks.isEmpty())
        {
            this.callbacks.pop()(msg);
        }
    }
}
