import {MessageType} from "../MessageType";

export enum Priority {
	Urgent,
	High,
	Moderate,
	Low,
}

export interface IMessageInstruction {
	id?: number, // Must be assigned upon broadcast
	name: string,
	payload?: string,
	priority?: Priority,
}