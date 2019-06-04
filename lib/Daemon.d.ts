/// <reference types="node" />
import {SecureContextOptions} from "tls";
import {connection}           from "websocket";
import Message                from "./Message";
import {Session}              from "./Session";
import WebSocket              from "./WebSocket";

export default class Daemon extends WebSocket
{
    private static sendMessage;
    sessions: Map<string, Session>;
    private resolveToken;
    private addToken;
    private delToken;

    constructor(listenPort: number, options: SecureContextOptions);

    sendPayload(message: Message, client: connection): void;

    broadcastPayload(message: Message): void;

    broadcastMessage(message: string): void;
}
