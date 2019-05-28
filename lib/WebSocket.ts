import {IncomingMessage, ServerResponse} from 'http';
import {connection, IMessage, server as WebSocketServer} from 'websocket';
import {Server} from 'https';
import {SecureContextOptions} from "tls";
import {EventEmitter} from "events";
import * as https from 'https';
import config from '../index';
import CLI from './cli';

const httpsRequest = (request: IncomingMessage, response: ServerResponse) => {
	console.info(new Date() + ' : Received request for resource ' + request.url);
	response.writeHead(200);
	response.end(`chat. Webserver Daemon [Version ${config.version}]`);
};

export default class WebSocket extends EventEmitter {
	private port: number;
	private https: Server;
	private ws: WebSocketServer;
	private clients: connection[];

	constructor(listenPort: number, options: SecureContextOptions) {
		super();

		this.port = listenPort;
		this.https = https.createServer(options, httpsRequest);
		this.https.listen(this.port);
		this.ws = new WebSocketServer({httpServer: this.https});
		this.clients = [];
		this.bindWebSocket(this.ws)
	}

	public bindWebSocket(ws: WebSocketServer): void {
		ws.on('connect', connection => {
			CLI.connect(`New connection from ${connection.remoteAddress}`);
			this.emit('connect', (connection: connection) => this.emit('connect', connection));
		});

		ws.on('close', (connection: connection, reason: number, desc: string) => {
			CLI.disconnect(`Received farewell from ${connection.remoteAddress}`);
			this.emit('close',
				(connection: connection, reason: number, desc: string) => this.emit('close', connection, reason, desc)
			)
		});

		function originIsAllowed(origin: string) {
			return true;
		}

		ws.on('request', request => {
			if (!originIsAllowed(request.origin)) {
				// Make sure we only accept requests from an allowed origin
				request.reject();
				console.log('\tConnection rejected.');
				CLI.warn('Connection Rejected');
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

	public getClients(): connection[] {
		return this.clients;
	}

	public getHttpsServer(): Server {
		return this.https
	}

	public getWebSocket(): WebSocketServer {
		return this.ws;
	}
}
