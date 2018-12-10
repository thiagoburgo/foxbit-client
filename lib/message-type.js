"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Request"] = 0] = "Request";
    MessageType[MessageType["Reply"] = 1] = "Reply";
    MessageType[MessageType["Subscribe"] = 2] = "Subscribe";
    MessageType[MessageType["Event"] = 3] = "Event";
    MessageType[MessageType["Unsubscribe"] = 4] = "Unsubscribe";
    MessageType[MessageType["Error"] = 5] = "Error";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
//# sourceMappingURL=message-type.js.map