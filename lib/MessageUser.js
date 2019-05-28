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
var Message_1 = __importDefault(require("./Message"));
var MessageUser = /** @class */ (function (_super) {
    __extends(MessageUser, _super);
    function MessageUser(message) {
        var _this = _super.call(this, message) || this;
        _this.getNick = function () { return _this.data.nickname; };
        _this.getFullName = function () { return _this.data.fullname; };
        _this.getEmail = function () { return _this.data.email; };
        _this.setNick = function (newName) {
            _this.data.nickname = newName;
        };
        _this.data = message;
        return _this;
    }
    MessageUser.fromJSON = function (arrJson) {
        return new MessageUser(arrJson);
    };
    return MessageUser;
}(Message_1.default));
exports.default = MessageUser;
