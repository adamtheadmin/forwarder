import * as net from "net";

export interface Server {
    server: net.Socket;
    sessionId: string;
}