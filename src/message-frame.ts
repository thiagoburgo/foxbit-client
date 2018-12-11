import { MessageType } from './message-enums';

export class MessageFrame {

  public sequence: number;

  public payload?: any;

  public functionName: string;

  public messageType: MessageType;

  constructor(messageType: MessageType,
              functionName: string,
              payload?: any) {
    this.messageType = messageType;
    this.functionName = functionName;
    this.payload = payload;
    this.sequence = 0;
  }

  toJSON() {
    return {
      m: this.messageType,
      i: this.sequence,
      n: this.functionName,
      o: JSON.stringify(this.payload),
    };
  }
}
