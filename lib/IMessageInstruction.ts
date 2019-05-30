import {MessageType} from "./MessageType";

export enum Priority {
	Urgent,
	High,
	Moderate,
	Low,
}

export interface IMessageInstruction {
	name: string,
	additional_payload: string,
	priority?: Priority,
}