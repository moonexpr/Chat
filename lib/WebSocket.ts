import {EventEmitter}                                             from "events";
import {IncomingMessage, ServerResponse}                          from 'http';
import * as https                                                 from 'https';
import {Server}                                                   from 'https';
import {SecureContextOptions}                                     from "tls";
import {connection, IMessage, request, server as WebSocketServer} from 'websocket';
import CLI                                                        from './cli';
import config                                                     from "./Configuration";

const httpsRequest = (request: IncomingMessage, response: ServerResponse) =>
{
    console.info(new Date() + ' : Received request for resource ' + request.url);
    response.writeHead(200);
    response.end(`chat. Webserver Daemon [Version ${config.version}]`);
};

export default class WebSocket extends EventEmitter
{
    port: number;
    https: Server;
    ws: WebSocketServer;
    clients: connection[];

    constructor(listenPort: number, options: SecureContextOptions)
    {
        super();

        this.port = listenPort;
        this.https = https.createServer(options, httpsRequest);
        this.https.listen(this.port);
        this.ws = new WebSocketServer({httpServer: this.https});
        this.clients = [];
        this.bindWebSocket(this.ws);
    }

    public bindWebSocket(ws: WebSocketServer): void
    {
        ws.on('connect', client =>
        {
            CLI.connect(`New connection from ${client.remoteAddress}`);
            this.emit('connect', client);
        });

        ws.on('close', (client: connection, reason: number, desc: string) =>
        {
            CLI.disconnect(`Received farewell from ${client.remoteAddress}`);
            this.emit('close', client, reason, desc);
        });

        ws.on('request', (request: request) =>
        {
            if (!this.originIsAllowed(request))
            {
                // Make sure we only accept requests from an allowed origin
                request.reject();
                CLI.log('\t♥ Connection Rejected');
                return;
            }

            let connection = request.accept('chat.', request.origin);
            CLI.log(`\tTarget: ${request.host}`);
            CLI.log(`\tOrigin: ${request.origin}`);
            CLI.log(`\tRemote Address: ${request.remoteAddress}`);
            CLI.log('\t☺ Connection accepted.');

            this.clients.push(connection);

            connection.on('message', (message: IMessage) => this.emit('message', message, connection));
        });
    }

    public getClients(): connection[]
    {
        return this.clients;
    }

    public getHttpsServer(): Server
    {
        return this.https;
    }

    public getWebSocket(): WebSocketServer
    {
        return this.ws;
    }

    private originIsAllowed(request: request)
    {
        this.clients.forEach((client: connection) =>
        {
            if (client.remoteAddress == request.remoteAddress)
            {
                return false;
            }
        });

        return true;
    }
}
