"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket_1 = __importDefault(require("./WebSocket"));
var Message_1 = __importDefault(require("./Message"));
var MessageType_1 = require("./MessageType");
var Session_1 = require("./Session");
var MessageUser_1 = __importDefault(require("./MessageUser"));
var Daemon = /** @class */ (function (_super) {
    __extends(Daemon, _super);
    function Daemon(listenPort, options) {
        var _this = _super.call(this, listenPort, options) || this;
        _this.sessions = new Map();
        _this.on('connect', _this.addToken);
        _this.on('close', _this.delToken);
        _this.on('message', _this.resolveToken);
        return _this;
    }
    Daemon.prototype.resolveToken = function (message, client) {
        if (message.utf8Data == undefined)
            return;
        var session = this.sessions.get(client.remoteAddress), payload = MessageUser_1.default.fromJSON(JSON.parse(message.utf8Data));
        if (session != undefined && session.isValidToken(payload.getToken())) {
            this.emit('chat', session, payload);
        }
        else {
            this.emit('badchat', client, payload);
        }
    };
    Daemon.prototype.addToken = function (client) {
        var session = new Session_1.Session(client);
        this.sessions.set(client.remoteAddress, session);
        this.emit('authorize', client, session);
        return session;
    };
    Daemon.prototype.delToken = function (client) {
        this.sessions.delete(client.remoteAddress);
    };
    Daemon.sendMessage = function (message, client) {
        client.send(message);
    };
    Daemon.prototype.sendPayload = function (message, client) {
        var payload = JSON.stringify(message.data);
        Daemon.sendMessage(payload, client);
    };
    Daemon.prototype.broadcastPayload = function (message) {
        var payload = JSON.stringify(message.data);
        this.getClients().forEach(function (client) { return Daemon.sendMessage(payload, client); });
    };
    Daemon.prototype.broadcastMessage = function (message) {
        var msg = new Message_1.default({
            'type': MessageType_1.MessageType.Host,
            'content': message,
        });
        this.broadcastPayload(msg);
    };
    return Daemon;
}(WebSocket_1.default));
exports.default = Daemon;
