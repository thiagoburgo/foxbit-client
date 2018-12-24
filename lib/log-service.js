"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
var rotateFileBaseOptions = {
    datePattern: 'YYYY-MM-DD-HH',
    // zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    dirname: './logs'
};
winston_1.loggers.add('default', {
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default(__assign({
            filename: 'foxbit-client-%DATE%.log'
        }, rotateFileBaseOptions))
    ],
    exceptionHandlers: [
        new winston_daily_rotate_file_1.default(__assign({
            filename: 'foxbit-client-%DATE%.exceptions.log'
        }, rotateFileBaseOptions))
    ],
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1.format.printf(function (template) { return template.timestamp + " [" + template.level.toUpperCase() + "]: " + template.message; }))
});
winston_1.loggers.add('ws', {
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default(__assign({
            filename: 'foxbit-client-%DATE%.websocket.log'
        }, rotateFileBaseOptions))
    ],
    exceptionHandlers: [
        new winston_daily_rotate_file_1.default(__assign({
            filename: 'foxbit-client-websocket-%DATE%.exceptions.log'
        }, rotateFileBaseOptions))
    ],
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1.format.printf(function (template) { return template.timestamp + " [" + template.level.toUpperCase() + "]: " + template.message; }))
});
exports.logger = winston_1.loggers.get('default');
exports.wsLogger = winston_1.loggers.get('ws');
//# sourceMappingURL=log-service.js.map