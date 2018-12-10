"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var EndpointMethodReplyType;
(function (EndpointMethodReplyType) {
    EndpointMethodReplyType[EndpointMethodReplyType["Response"] = 0] = "Response";
    EndpointMethodReplyType[EndpointMethodReplyType["Event"] = 1] = "Event";
})(EndpointMethodReplyType = exports.EndpointMethodReplyType || (exports.EndpointMethodReplyType = {}));
var EndpointMethodType;
(function (EndpointMethodType) {
    EndpointMethodType[EndpointMethodType["Public"] = 0] = "Public";
    EndpointMethodType[EndpointMethodType["Private"] = 1] = "Private";
})(EndpointMethodType = exports.EndpointMethodType || (exports.EndpointMethodType = {}));
var EndpointMethodDescriptor = /** @class */ (function () {
    function EndpointMethodDescriptor(methodType, methodReplyType, methodSubject) {
        if (methodType === void 0) { methodType = EndpointMethodType.Private; }
        if (methodReplyType === void 0) { methodReplyType = EndpointMethodReplyType.Response; }
        if (methodSubject === void 0) { methodSubject = new rxjs_1.Subject(); }
        this.methodType = methodType;
        this.methodReplyType = methodReplyType;
        this.methodSubject = methodSubject;
    }
    return EndpointMethodDescriptor;
}());
exports.EndpointMethodDescriptor = EndpointMethodDescriptor;
//# sourceMappingURL=api-descriptors.js.map