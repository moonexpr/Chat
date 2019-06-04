/// <reference types="node" />
import {EventEmitter}                          from "events";
import {Server}                                from 'https';
import {SecureContextOptions}                  from "tls";
import {connection, server as WebSocketServer} from 'websocket';

export default class WebSocket extends EventEmitter
{
    port: number;
    https: Server;
    ws: WebSocketServer;
    clients: connection[];

    constructor(listenPort: number, options: SecureContextOptions);

    bindWebSocket(ws: WebSocketServer): void;

    getClients(): connection[];

    getHttpsServer(): Server;

    getWebSocket(): WebSocketServer;
}
