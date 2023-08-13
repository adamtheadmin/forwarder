import {Socket} from "socket.io";
import {Moment} from "moment";

export interface ActiveConnection {
    client: any;
    name: string;
    sessionId: string;
    createdAt: Moment;
    lastPacketSentAt: Moment|null;
}

export interface CreateConnectionData {
    sessionId: string;
    remotePort: number;
    name: string;
    forwardTo: string;
    socket: Socket;
}

export interface WriteConnectionData {
    sessionId: string;
    data: string|Buffer;
}