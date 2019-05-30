import {SecureContextOptions} from "tls";
import WebSocket from "./WebSocket";
import Message from "./Message";
import {connection, IMessage as IncomingMessage} from "websocket";
import {MessageType} from "./MessageType";
import {Session} from "./Session";
import MessageUser from "./MessageUser";
import {IMessageUser} from "./IMessageUser";
import {IMessage} from "./IMessage";
import {Instruction} from "./Instruction";
import {IMessageInstruction} from "./IMessageInstruction";


export default class Daemon extends WebSocket {

	sessions: Map<string, Session>;
	instructions: Map<number, Instruction>;

	constructor(listenPort: number, options: SecureContextOptions) {
		super(listenPort, options);

		this.sessions = new Map();
		this.instructions = new Map();

		this.on('connect', this.addToken);
		this.on('close', this.delToken);
		this.on('message', this.resolveToken);
		this.on('process', this.processMessage);
	}

	private resolveToken(message: IncomingMessage, client: connection): void {
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


		if (!session.isValidToken(payload.getToken())) {
			this.emit('badchat', session, payload);
		}

		this.emit('process', session, payload);
	}

	private processMessage(session: Session, payload: MessageUser): void {
		if (payload.instruction && payload.instruction.id != undefined) {
			const instr = this.instructions.get(payload.instruction.id);
			if (instr != undefined) {
				instr.resolve(payload)
			}

			return;
		}

		this.emit('chat', session, payload);
	}

	private addToken(client: connection): Session {
		const session = new Session(client);
		this.emit('authorize', client, session);

		this.sessions.set(client.remoteAddress, session);

		return session;
	}

	private delToken(client: connection): void {
		this.sessions.delete(client.remoteAddress);
	}

	private static sendMessage(message: string, client: connection): void {
		client.send(message);
	}

	public sendInstruction<T extends Instruction>(instr: Instruction, client: connection): Instruction {
		this.sendPayload({
			type: MessageType.Host,
			content: '',
			instruction: instr,
		}, client);

		this.instructions.set(instr.getId(), instr);

		return instr;
	}

	public sendMessage(text: string, client: connection): void {
		this.sendPayload({
			type: MessageType.Host,
			content: text
		}, client);
	}


	public sendPayload<T extends IMessage>(message: T, client: connection): void {
		let payload = JSON.stringify(message);

		Daemon.sendMessage(payload, client);
	}

	public broadcastPayload<T extends IMessage>(message: T): void {
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