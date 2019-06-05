import * as fs         from "fs";
import {connection}    from "websocket";
import CLI             from "./lib/CLI";
import * as config     from "./lib/Configuration";
import Daemon          from "./lib/Daemon";
import ISessionPayload from "./lib/models/ISessionPayload";
import {Session}       from "./lib/Session";

console.info(`chat. Webserver Daemon [Version ${config.default.version}]`);

const daemon = new Daemon(8443, {
    cert: fs.readFileSync("certs/cert.pem"),
    key: fs.readFileSync("certs/key.pem"),
    passphrase: "Aperture1!",
});

CLI.init();

console.log("Copyright (c) 2019 John Chandara\n");

daemon.on("authorize", (client: connection, session: Session) =>
{
    daemon.sendMessage(`Hello, my name is ${require("os").hostname()}, and I will be your server for this evening.`, client);
});

daemon.on("chat", (sessionMessage: ISessionPayload) =>
{
    const message = sessionMessage.payload;

    CLI.log(`${message.getIdentity().fullname}: ${message.content}`, "@");

    // We need to manually redeclare the payload in
    // order to ensure the interface is being satisfied
    const chatMessage = message.getSanitisedObject();
    daemon.broadcastPayload(chatMessage);
});

daemon.on("badchat", (sessionMessage: ISessionPayload) =>
{
    const session = sessionMessage.session,
        message = sessionMessage.payload,
        client = session.getClient();

    CLI.warn(`${client.remoteAddress} has a malformed token.
		(reg: ${session.getToken()}; rep: ${message.getToken()})`);

    daemon.sendMessage(
        "We are sorry, but you're connection token is not valid, please reconnect.",
        client,
    );
});
