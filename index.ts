import * as fs from "fs";
import CLI from "./lib/CLI";
import {connection} from "websocket";
import Daemon from "./lib/Daemon";
import {Session} from "./lib/Session";
import * as config from "./lib/Configuration";
import ISessionPayload from "./lib/models/ISessionPayload";

console.info(`chat. Webserver Daemon [Version ${config.default.version}]`);

const daemon = new Daemon(8443, {
	cert: fs.readFileSync('certs/cert.pem'),
	key: fs.readFileSync('certs/key.pem'),
	passphrase: 'Aperture1!',
});

CLI.init();


console.log('Copyright (c) 2019 John Chandara\n');

daemon.on('authorize', (client: connection, session: Session) => {
	daemon.sendMessage(`Hello, my name is ${require('os').hostname()}, and I will be your server for this evening.`, client)
});


daemon.on('chat', (sessionMessage: ISessionPayload) => {
	let message = sessionMessage.payload;

	CLI.log(`${message.getIdentity().fullname}: ${message.content}`, '@');

	daemon.broadcastPayload(message);
});

daemon.on('badchat', (sessionMessage: ISessionPayload) => {
	let session = sessionMessage.session,
		message = sessionMessage.payload,
		client = session.getClient();

	CLI.warn(`${client.remoteAddress} has a malformed token.
		(reg: ${session.getToken()}; rep: ${message.getToken()})`);

	daemon.sendMessage(
		'We are sorry, but you\'re connection token is not valid, please reconnect.',
		client
	);
});