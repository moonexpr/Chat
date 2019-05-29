import {SecureContextOptions} from "tls";
import WebSocket from "./WebSocket";
import Message from "./Message";
import {connection} from "websocket";
import {MessageType} from "./MessageType";


export default class Daemon extends WebSocket {

	constructor(listenPort: number, options: SecureContextOptions) {
		super(listenPort, options);
	}

	private sendMessage(message: string, client: connection): void {
		client.send(message);
	}

	public sendPayload(message: Message, client: connection): void {
		let payload = JSON.stringify(message.data);

		this.sendMessage(payload, client);
	}


	public broadcastPayload(message: Message): void {
		let payload = JSON.stringify(message.data);

		this.getClients().forEach(client => this.sendMessage(payload, client));
	}

	public broadcastMessage(message: string): void {
		let msg = new Message({
			'type': MessageType.Host,
			'content': message,
		});

		this.broadcastPayload(msg);
	}
}