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
var websocket_1 = require("websocket");
var events_1 = require("events");
var https = __importStar(require("https"));
var index_1 = __importDefault(require("../index"));
var cli_1 = __importDefault(require("./cli"));
var httpsRequest = function (request, response) {
    console.info(new Date() + ' : Received request for resource ' + request.url);
    response.writeHead(200);
    response.end("chat. Webserver Daemon [Version " + index_1.default.version + "]");
};
var WebSocket = /** @class */ (function (_super) {
    __extends(WebSocket, _super);
    function WebSocket(listenPort, options) {
        var _this = _super.call(this) || this;
        _this.port = listenPort;
        _this.https = https.createServer(options, httpsRequest);
        _this.https.listen(_this.port);
        _this.ws = new websocket_1.server({ httpServer: _this.https });
        _this.clients = [];
        _this.bindWebSocket(_this.ws);
        return _this;
    }
    WebSocket.prototype.bindWebSocket = function (ws) {
        var _this = this;
        ws.on('connect', function (connection) {
            cli_1.default.connect("New connection from " + connection.remoteAddress);
            _this.emit('connect', function (connection) { return _this.emit('connect', connection); });
        });
        ws.on('close', function (connection, reason, desc) {
            cli_1.default.disconnect("Received farewell from " + connection.remoteAddress);
            _this.emit('close', function (connection, reason, desc) { return _this.emit('close', connection, reason, desc); });
        });
        function originIsAllowed(origin) {
            return true;
        }
        ws.on('request', function (request) {
            if (!originIsAllowed(request.origin)) {
                // Make sure we only accept requests from an allowed origin
                request.reject();
                console.log('\tConnection rejected.');
                cli_1.default.warn('Connection Rejected');
                return;
            }
            var connection = request.accept('chat.', request.origin);
            cli_1.default.log("\tTarget: " + request.host);
            cli_1.default.log("\tOrigin: " + request.origin);
            cli_1.default.log("\tRemote Address: " + request.remoteAddress);
            cli_1.default.log('\t☺ Connection accepted.');
            _this.clients.push(connection);
            connection.on('message', function (message) { return _this.emit('message', message, connection); });
        });
    };
    WebSocket.prototype.getClients = function () {
        return this.clients;
    };
    WebSocket.prototype.getHttpsServer = function () {
        return this.https;
    };
    WebSocket.prototype.getWebSocket = function () {
        return this.ws;
    };
    return WebSocket;
}(events_1.EventEmitter));
exports.default = WebSocket;
