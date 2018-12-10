"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageFrame = /** @class */ (function () {
    function MessageFrame(messageType, functionName, payload) {
        this.messageType = messageType;
        this.functionName = functionName;
        this.payload = payload;
        this.sequence = 0;
    }
    MessageFrame.prototype.toJSON = function () {
        return {
            m: this.messageType,
            i: this.sequence,
            n: this.functionName,
            o: JSON.stringify(this.payload),
        };
    };
    return MessageFrame;
}());
exports.MessageFrame = MessageFrame;
//# sourceMappingURL=message-frame.js.map