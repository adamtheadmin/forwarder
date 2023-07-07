import {Socket} from "socket.io";
import configParser from "./configParser";
import {PortForward} from "../@types/Config";
import * as net from 'net';
import { v4 as uuidv4 } from 'uuid';
import {Server} from "../@types/state/Server";
import {ActiveConnection} from "../@types/state/ActiveConnection";

const config = configParser();
const activeConnections: ActiveConnection[] = [];
const servers: {sessionId: string; socket: net.Socket}[] = [];

export function ProxyEvents(socket: Socket) {

    socket.on('createConnection', (data) => {
        if (data?.forwardTo !== config.Name) {
            return;
        }

        const client = new net.Socket();
        client.connect(data.remotePort, data.remoteHost);
        activeConnections.push({
            client,
            sessionId: data.sessionId,
            name: data.name
        });

        client.on('data', (clientData) => {
            socket.emit('response', {
                sessionId: data.sessionId,
                data: clientData
            });
        });

        client.on('end', () => {
            socket.emit('endResponse', {
                sessionId: data.sessionId,
            });
            const index = activeConnections.findIndex(conn => conn.sessionId === data.sessionId);
            if (index !== -1) {
                activeConnections.splice(index, 1);
            }
        });

        client.on('error', (e:Error) => {
            console.error(e);
        })
    });


    socket.on('sendPacket', (data) => {
        const connection = activeConnections.find((connection: ActiveConnection) => connection.sessionId === data.sessionId);
        if (connection) {
            connection.client.write(data.data);
        }
    });

    socket.on('endConnection', (data) => {
        const index = activeConnections.findIndex(conn => conn.sessionId === data.sessionId);
        if (index !== -1) {
            activeConnections[index].client.destroy();
            activeConnections.splice(index, 1);
        }
    });

    socket.on('response', ({ sessionId, data }) => {
        const server = servers.find((server) => server.sessionId === sessionId);
        if (server) {
            server.socket.write(data);
        }
    });

    socket.on('endResponse', ({ sessionId }) => {
        const server = servers.find((server) => server.sessionId === sessionId);
        if (server) {
            server.socket.end();
        }
    });
}

export function handleIncomingConnections(io: any) {
    const PortForwards:PortForward[] = config.PortForwards;
    for (const port of PortForwards) {
        const server = net.createServer((socket) => {
            const sessionId = uuidv4();
            servers.push({
                sessionId,
                socket
            });
            io.emit('createConnection', {
                sessionId,
                remotePort: port.RemotePort,
                remoteHost: port.RemoteHost,
                name: port.Name,
                forwardTo: port.ForwardTo
            });
            socket.on('data', (data) => {
                io.emit('sendPacket', { sessionId, data});
            });

            socket.on('end', () => {
                io.emit('endConnection', { sessionId });
            });
        });

        server.listen(port.LocalPort, () => {
        });
    }
}