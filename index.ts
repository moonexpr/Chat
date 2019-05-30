import * as fs from "fs";
import CLI from "./lib/CLI";
import {connection} from "websocket";
import Daemon from "./lib/Daemon";
import MessageUser from "./lib/MessageUser";
import {MessageType} from "./lib/MessageType";
import {Session} from "./lib/Session";
import * as config from "./lib/Configuration";

console.info(`chat. Webserver Daemon [Version ${config.default.version}]`);

const daemon = new Daemon(8443, {
	cert: fs.readFileSync('certs/cert.pem'),
	key: fs.readFileSync('certs/key.pem'),
	passphrase: 'Aperture1!',
});

console.log('Copyright (c) 2019 John Chandara\n');

daemon.on('begin_authorize', (client: connection, session: Session) =>
	daemon.sendPayload({
		type: MessageType.Host,
		content: session.getToken(),
		instruction: {
			name: 'setToken',
			additional_payload: '[]'
		}
	}, client));

daemon.on('chat', (session: Session, message: MessageUser) => {
	CLI.log(`${message.fullname}: ${message.getContent()}`, '@');
	daemon.broadcastPayload(message);
});

daemon.on('badchat', (session: Session, message: MessageUser) => {
	let client = session.getClient();

	CLI.warn(`${client.remoteAddress} has a malformed token.
		(reg: ${session.getToken()}; rep: ${message.getToken()})`);
	daemon.sendPayload({
		type: MessageType.Host,
		content: 'We are sorry, but you\'re connection token is not valid, please reconnect.'
	}, client);
});