import {Socket} from "socket.io";
import configParser from "./configParser";
import {PortForward} from "../@types/Config";
import * as net from 'net';
import { v4 as uuidv4 } from 'uuid';
import {ActiveConnection} from "../@types/state/ActiveConnection";

const config = configParser();
const activeConnections: ActiveConnection[] = [];
const serverSockets: {sessionId: string; socket: net.Socket}[] = [];
import {store} from "../store";

process.on('uncaughtException', (err) => {
    console.error(err);
});

export function ProxyEvents(socket: Socket) {

    socket.on('createConnection', (data) => {
        console.log('createConnection', data);
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
        const connection = activeConnections.find((connection) => connection.sessionId === data.sessionId);
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
        const server = serverSockets.find((server) => server.sessionId === sessionId);
        if (server) {
            server.socket.write(data);
        }
    });

    socket.on('endResponse', ({ sessionId }) => {
        const server = serverSockets.find((server) => server.sessionId === sessionId);
        if (server) {
            server.socket.end();
            const index = serverSockets.indexOf(server);
            serverSockets.splice(index, 1);
        }
    });

}

export function handleIncomingConnections(io: any) {
    const PortForwards:PortForward[] = config.PortForwards;
    for (const port of PortForwards) {
        const server = net.createServer((socket) => {
            const sessionId = uuidv4();
            const {gateways} = store.getState();
            const gateway = gateways.find((g) => g.name === port?.ForwardTo);
            if (!gateway) {
                console.error("Could not find gateway to make connection, ending socket.");
                socket.end();
                return;
            }
            serverSockets.push({
                sessionId,
                socket
            });
            const authenticatedClient = io.sockets.sockets.get(gateway?.socketId);
            if (!authenticatedClient) {
                console.error("Client Disconnected");
                socket.end();
                return;
            }
            authenticatedClient.emit('createConnection', {
                sessionId,
                remotePort: port.RemotePort,
                remoteHost: port.RemoteHost,
                name: port.Name,
                forwardTo: port.ForwardTo
            });
            socket.on('data', (data) => {
                authenticatedClient.emit('sendPacket', { sessionId, data});
            });

            socket.on('end', () => {
                authenticatedClient.emit('endConnection', { sessionId });
            });
        });

        server.listen(port.LocalPort);
    }
}