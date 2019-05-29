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
var Daemon = /** @class */ (function (_super) {
    __extends(Daemon, _super);
    function Daemon(listenPort, options) {
        return _super.call(this, listenPort, options) || this;
    }
    Daemon.prototype.sendMessage = function (message, client) {
        client.send(message);
    };
    Daemon.prototype.sendPayload = function (message, client) {
        var payload = JSON.stringify(message.data);
        this.sendMessage(payload, client);
    };
    Daemon.prototype.broadcastPayload = function (message) {
        var _this = this;
        var payload = JSON.stringify(message.data);
        this.getClients().forEach(function (client) { return _this.sendMessage(payload, client); });
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
