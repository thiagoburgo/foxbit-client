import { transports } from "winston";

declare namespace winston {
    export import transports2 = transports;
}