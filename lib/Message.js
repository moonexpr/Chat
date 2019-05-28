"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Message = /** @class */ (function () {
    function Message(message) {
        var _this = this;
        this.getContent = function () { return _this.data.content; };
        this.data = message;
    }
    Message.fromJSON = function (arrJson) {
        return new Message(arrJson);
    };
    return Message;
}());
exports.default = Message;
