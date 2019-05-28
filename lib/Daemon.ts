import {SecureContextOptions} from "tls";
import WebSocket from "./WebSocket";
import Message from "./Message";
import CLI from "./CLI";


export default class Daemon extends WebSocket {

	constructor(listenPort: number, options: SecureContextOptions) {
		super(listenPort, options);
	}

	public BroadcastPayload(message: Message): void {
		let payload = JSON.stringify(message.data);


		CLI.info(payload);

		this.getClients().forEach(client => client.send(payload));
	}

	public BroadcastMessage(message: string): void {
		let msg = new Message({
			'type': MessageType.Host,
			'content': message,
		});

		this.BroadcastPayload(msg);
	}
}