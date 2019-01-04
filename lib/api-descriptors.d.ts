import { Subject } from 'rxjs';
export declare enum EndpointMethodReplyType {
    Response = 0,
    Event = 1,
    ResponseAndEvent = 2
}
export declare enum EndpointMethodType {
    Public = 0,
    Private = 1
}
export declare class EndpointMethodDescriptor {
    methodType: EndpointMethodType;
    methodReplyType: EndpointMethodReplyType;
    methodSubject: Subject<any>;
    associatedEvent?: string;
    constructor(methodType?: EndpointMethodType, methodReplyType?: EndpointMethodReplyType, methodSubject?: Subject<any>, associatedEvent?: string);
}
