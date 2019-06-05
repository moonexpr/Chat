export enum Priority
{
    Urgent,
    High,
    Moderate,
    Low,
}

/**
 * Used to relay an action the client must do,
 * upon completion the client will send back a confirmation.
 */
export interface IMessageInstruction
{
    id?: number, // Must be assigned upon broadcast
    name: string,
    payload?: string,
    priority?: Priority,
}
