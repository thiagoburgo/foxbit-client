import { MessageType } from './message-enums';
export declare class MessageFrame {
    sequence: number;
    payload?: any;
    functionName: string;
    messageType: MessageType;
    constructor(messageType: MessageType, functionName: string, payload?: any);
    toJSON(): {
        m: MessageType;
        i: number;
        n: string;
        o: string;
    };
}
