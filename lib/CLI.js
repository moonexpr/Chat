"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CLI = /** @class */ (function () {
    function CLI() {
    }
    CLI.init = function () {
        this.startTime = Date.now();
    };
    CLI.checkInit = function () {
        if (this.startTime == undefined) {
            this.init();
        }
    };
    CLI.append = function (strMessage, strSlug) {
        this.checkInit();
        var diffTime = Date.now() - this.startTime;
        if (strSlug == undefined) {
            console.log(diffTime + ":\t" + strMessage);
        }
        else {
            console.log(diffTime + ":\t" + strSlug + "\t" + strMessage);
        }
    };
    CLI.log = function (strMessage, strSlug) { return CLI.append(strMessage, strSlug); };
    CLI.info = function (strMessage) { return CLI.append(strMessage, '?'); };
    CLI.connect = function (strMessage) { return CLI.append(strMessage, '->'); };
    CLI.disconnect = function (strMessage) { return CLI.append(strMessage, '<-'); };
    CLI.warn = function (strMessage) { return CLI.append(strMessage, '/!\\'); };
    CLI.error = function (strMessage) { return CLI.append(strMessage, '/!\\ Error!'); };
    return CLI;
}());
exports.default = CLI;
