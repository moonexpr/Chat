"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var CLI_1 = __importDefault(require("./lib/CLI"));
var Daemon_1 = __importDefault(require("./lib/Daemon"));
var Message_1 = __importDefault(require("./lib/Message"));
var MessageType_1 = require("./lib/MessageType");
var config = {
    'version': '1.0',
    'token_hash': '4gu#%$G'
};
exports.default = config;
console.info("chat. Webserver Daemon [Version " + config.version + "]");
console.log('Copyright (c) 2019 John Chandara\n');
var daemon = new Daemon_1.default(8443, {
    cert: fs.readFileSync('certs/cert.pem'),
    key: fs.readFileSync('certs/key.pem'),
    passphrase: 'Aperture1!',
});
daemon.on('authorize', function (client, session) {
    return daemon.sendPayload(new Message_1.default({
        'type': MessageType_1.MessageType.Host,
        'content': "::" + session.getToken()
    }), client);
});
daemon.on('chat', function (session, message) {
    CLI_1.default.log(session.client + ": " + message.getContent(), '@');
    daemon.broadcastPayload(message);
});
daemon.on('badchat', function (client, message) {
    CLI_1.default.warn(client.remoteAddress + " has a malformed token.");
    daemon.sendPayload(new Message_1.default({
        'type': MessageType_1.MessageType.Host,
        'content': 'We are sorry, but you\'re connection token is not valid, please reconnect.'
    }), client);
});
