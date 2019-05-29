import * as fs from "fs";
import CLI from "./lib/CLI";
import {connection, IMessage as IncomingMessage} from "websocket";
import Daemon from "./lib/Daemon";
import MessageUser from "./lib/MessageUser";
import Message from "./lib/Message";
import {IMessageUser} from './lib/IMessageUser';
import {MessageType} from "./lib/MessageType";

const config = {
	'version': '1.0'
};

export default config;

console.info(`chat. Webserver Daemon [Version ${config.version}]`);
console.log('Copyright (c) 2019 John Chandara\n');

const daemon = new Daemon(8443, {
	cert: fs.readFileSync('certs/cert.pem'),
	key: fs.readFileSync('certs/key.pem'),
	passphrase: 'Aperture1!',
});

daemon.on('connect', (client: connection) => {

	daemon.sendPayload(
		new Message({
			'type': MessageType.Host,
			'content': 'test host message',
		}), client);

	daemon.sendPayload(
		new Message({
			'type': MessageType.Network,
			'content': 'test net message',
		}), client);
});

daemon.on('message', (message: IncomingMessage, connection: connection) => {
	CLI.log(`${connection.remoteAddress}: ${message.utf8Data}`, '@');
	const payload = message.utf8Data;

	if (payload != undefined) {
		let msg: MessageUser = MessageUser.fromJSON(<IMessageUser>JSON.parse(payload));
		daemon.broadcastPayload(msg);
	}
});