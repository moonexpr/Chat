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
var MessageUser_1 = __importDefault(require("./lib/MessageUser"));
var config = {
    'version': '1.0'
};
exports.default = config;
console.info("chat. Webserver Daemon [Version " + config.version + "]");
console.log('Copyright (c) 2019 John Chandara\n');
var daemon = new Daemon_1.default(8443, {
    cert: fs.readFileSync('certs/cert.pem'),
    key: fs.readFileSync('certs/key.pem'),
    passphrase: 'Aperture1!',
});
daemon.on('message', function (message, connection) {
    CLI_1.default.log(connection.remoteAddress + ": " + message.utf8Data, '@');
    var payload = message.utf8Data;
    if (payload != undefined) {
        var msg = MessageUser_1.default.fromJSON(JSON.parse(payload));
        daemon.BroadcastPayload(msg);
    }
});
