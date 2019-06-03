import {SecureContextOptions} from "tls";
import {connection, IMessage as IncomingMessage} from "websocket";
import {MessageType} from "./MessageType";
import {Session} from "./Session";
import {IMessageUser} from "./models/IMessageUser";
import {IMessage} from "./models/IMessage";
import {Instruction} from "./Instruction";
import WebSocket from "./WebSocket";
import Message from "./Message";
import MessageUser from "./MessageUser";
import ISessionPayload from "./models/ISessionPayload";


export default class Daemon extends WebSocket {

	sessions: Map<string, Session>;
	instructions: Map<number, Instruction>;

	constructor(listenPort: number, options: SecureContextOptions) {
		super(listenPort, options);

		this.sessions = new Map();
		this.instructions = new Map();

		this.on('connect', this.addToken);
		this.on('authorize', this.authorize);
		this.on('message', this.resolveToken);
		this.on('process', this.processMessage);
		this.on('close', this.delToken);
	}

	private startSession(message: IncomingMessage, client: connection): ISessionPayload {
		let session: Session | undefined = this.sessions.get(client.remoteAddress),
			payload: MessageUser;

		if (session === undefined || session.identity === undefined || message.utf8Data === undefined) {
			client.close();
			throw Error('It seems somehow by pure bad luck you did something weird with our network, let\'s reconnect you...');
		}

		try {
			return {
				session: session,
				payload: new MessageUser(session.identity, <IMessageUser>JSON.parse(message.utf8Data)),
				timestamp: new Date(),
			};
		} catch (_) {
			throw Error('Your chat client is misconfigured, please contact your local developer to get this fixed!')
		}

	}

	private resolveToken(message: IncomingMessage, client: connection): void {
		try {
			let sessionMessage = this.startSession(message, client);
			let session = sessionMessage.session,
				payload = sessionMessage.payload;

			if (!session.isValidToken(payload.getToken())) {
				this.emit('badchat', sessionMessage);
			}

			this.emit('process', sessionMessage);
		} catch (_) {
			this.sendMessage((<Error>_).message, client);
		}
	}

	private processMessage(sessionMessage: ISessionPayload): void {
		let payload = sessionMessage.payload;

		if (payload.instruction && payload.instruction.id != undefined) {
			const instr = this.instructions.get(payload.instruction.id);
			if (instr != undefined) {
				instr.resolve(payload)
			}

			return;
		}

		this.emit('chat', sessionMessage);
	}

	private addToken(client: connection): Session {
		const session = new Session(client);
		this.emit('authorize', client, session);

		this.sessions.set(client.remoteAddress, session);

		return session;
	}

	private authorize(client: connection, session: Session): void {
		const getToken = new Instruction({
			payload: session.getToken(),
			name: 'setToken'
		});

		const getProfile = new Instruction({
			payload: '',
			name: 'getProfile'
		});

		this.sendInstruction(getToken, client)
			.then(() => this.sendInstruction(getProfile, client).then((msg: IMessage) => {
				if (msg.instruction !== undefined && msg.instruction.payload !== undefined) {
					try {
						session.setIdentity(<Identity>JSON.parse(msg.instruction.payload));
					} catch (exception) {
						this.sendMessage('Your identity cannot be validated, please contact your local developer.', client);
						client.close();
					}
				}
			}));
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
			timestamp: new Date()
		}, client);

		this.instructions.set(instr.getId(), instr);

		return instr;
	}

	public sendMessage(text: string, client: connection): void {
		this.sendPayload({
			type: MessageType.Host,
			content: text,
			timestamp: new Date(),
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
			timestamp: new Date(),
		});

		this.broadcastPayload(msg);
	}
}