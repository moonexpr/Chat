/// <reference types="node" />
import { SecureContextOptions } from "tls";
import WebSocket from "./WebSocket";
import Message from "./Message";
import { connection } from "websocket";
import { Session } from "./Session";
export default class Daemon extends WebSocket {
    sessions: Map<string, Session>;
    constructor(listenPort: number, options: SecureContextOptions);
    private resolveToken;
    private addToken;
    private delToken;
    private static sendMessage;
    sendPayload(message: Message, client: connection): void;
    broadcastPayload(message: Message): void;
    broadcastMessage(message: string): void;
}
