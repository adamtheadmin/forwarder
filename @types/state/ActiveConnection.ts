import * as buffer from "buffer";
import {Socket} from "socket.io";

export interface ActiveConnection {
    client: any;
    name: string;
    sessionId: string;
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