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
var CLI_1 = __importDefault(require("./CLI"));
var Daemon = /** @class */ (function (_super) {
    __extends(Daemon, _super);
    function Daemon(listenPort, options) {
        return _super.call(this, listenPort, options) || this;
    }
    Daemon.prototype.BroadcastPayload = function (message) {
        var payload = JSON.stringify(message.data);
        CLI_1.default.info(payload);
        this.getClients().forEach(function (client) { return client.send(payload); });
    };
    Daemon.prototype.BroadcastMessage = function (message) {
        var msg = new Message_1.default({
            'type': MessageType.Host,
            'content': message,
        });
        this.BroadcastPayload(msg);
    };
    return Daemon;
}(WebSocket_1.default));
exports.default = Daemon;
