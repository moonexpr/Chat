import {SecureContextOptions} from "tls";
import WebSocket from "./WebSocket";
import Message from "./Message";
import {connection, IMessage as IncomingMessage} from "websocket";
import {MessageType} from "./MessageType";
import {Session} from "./Session";
import MessageUser from "./MessageUser";
import {IMessageUser} from "./IMessageUser";
import {IMessage} from "./IMessage";


export default class Daemon extends WebSocket {

	sessions: Map<string, Session>;

	constructor(listenPort: number, options: SecureContextOptions) {
		super(listenPort, options);

		this.sessions = new Map();

		this.on('connect', this.addToken);
		this.on('close', this.delToken);
		this.on('message', this.resolveToken);
	}

	private resolveToken(message: IncomingMessage, client: connection) {
		if (message.utf8Data == undefined)
			return;

		let session: Session | undefined = this.sessions.get(client.remoteAddress),
			payload: MessageUser = MessageUser.fromJSON(<IMessageUser>JSON.parse(message.utf8Data));

		if (session == undefined) {
			this.sendPayload({
				type: MessageType.Host,
				content: 'It seems somehow by pure bad luck you did something weird with our network, let\'s reconnect you...',
			}, client);

			client.close();

			return;
		}

		if (session.isValidToken(payload.getToken())) {
			this.emit('chat', session, payload);
		} else {
			this.emit('badchat', session, payload);
		}
	}

	private addToken(client: connection): Session {
		const session = new Session(client);
		this.sessions.set(client.remoteAddress, session);

		this.emit('begin_authorize', client, session);

		return session;
	}

	private delToken(client: connection): void {
		this.sessions.delete(client.remoteAddress);
	}

	private static sendMessage(message: string, client: connection): void {
		client.send(message);
	}

	public sendPayload<T extends IMessage>(message: T, client: connection): void {
		let payload = JSON.stringify(message);

		Daemon.sendMessage(payload, client);
	}

	public broadcastPayload<T extends IMessage> (message: T): void {
		let payload = JSON.stringify(message);

		this.getClients().forEach(client => Daemon.sendMessage(payload, client));
	}

	public broadcastMessage(message: string): void {
		let msg = new Message({
			'type': MessageType.Host,
			'content': message,
		});

		this.broadcastPayload(msg);
	}
}