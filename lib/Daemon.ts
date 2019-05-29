import {SecureContextOptions} from "tls";
import WebSocket from "./WebSocket";
import Message from "./Message";
import {connection, IMessage as IncomingMessage} from "websocket";
import {MessageType} from "./MessageType";
import {Session} from "./Session";
import MessageUser from "./MessageUser";
import {IMessageUser} from "./IMessageUser";


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

		if (session != undefined && session.isValidToken(payload.getToken())) {
			this.emit('chat', session, payload);
		} else {
			this.emit('badchat', client, payload);
		}
	}

	private addToken(client: connection): Session {
		const session = new Session(client);
		this.sessions.set(client.remoteAddress, session);

		this.emit('authorize', client, session);

		return session;
	}

	private delToken(client: connection): void {
		this.sessions.delete(client.remoteAddress);
	}

	private static sendMessage(message: string, client: connection): void {
		client.send(message);
	}

	public sendPayload(message: Message, client: connection): void {
		let payload = JSON.stringify(message.data);

		Daemon.sendMessage(payload, client);
	}

	public broadcastPayload(message: Message): void {
		let payload = JSON.stringify(message.data);

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