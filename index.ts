import * as fs from "fs";
import CLI from "./lib/CLI";
import {connection} from "websocket";
import Daemon from "./lib/Daemon";
import MessageUser from "./lib/MessageUser";
import Message from "./lib/Message";
import {MessageType} from "./lib/MessageType";
import {Session} from "./lib/Session";

const config = {
	'version': '1.0',
	'token_hash': '4gu#%$G'
};

export default config;

console.info(`chat. Webserver Daemon [Version ${config.version}]`);
console.log('Copyright (c) 2019 John Chandara\n');

const daemon = new Daemon(8443, {
	cert: fs.readFileSync('certs/cert.pem'),
	key: fs.readFileSync('certs/key.pem'),
	passphrase: 'Aperture1!',
});

daemon.on('authorize', (client: connection, session: Session) =>
	daemon.sendPayload(new Message({
		'type': MessageType.Host,
		'content': `::${session.getToken()}`
	}), client));

daemon.on('chat', (session: Session, message: MessageUser) => {
	CLI.log(`${session.client}: ${message.getContent()}`, '@');
	daemon.broadcastPayload(message);
});

daemon.on('badchat', (client: connection, message: MessageUser) => {
	CLI.warn(`${client.remoteAddress} has a malformed token.`);
	daemon.sendPayload(new Message({
		'type': MessageType.Host,
		'content': 'We are sorry, but you\'re connection token is not valid, please reconnect.'
	}), client);
});