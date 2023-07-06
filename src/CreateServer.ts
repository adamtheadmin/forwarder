import { createServer } from "http";
import {Server, Socket} from "socket.io";
import {store} from "../store";
import {connect, disconnect} from "../store/reducers/gateways";
import configParser from '../src/configParser';
import {handleIncomingConnections, ProxyEvents} from "./ProxyEvents";

export default function CreateServer() {
    const config = configParser();

    const httpServer = createServer();
    const io = new Server(httpServer, {});

    io.on("connection", (socket: Socket) => {
        socket.on('register', (data: any) => {
            console.log('client registered', data);
            // @ts-ignore
            store.dispatch(connect({
                name: data.name,
                socketId: socket.id
            }));
        });

        socket.on("disconnect", () => {
            // @ts-ignore
            store.dispatch(disconnect({socketId: socket.id}));
        });

        ProxyEvents(socket);
    });

    handleIncomingConnections(io);

    httpServer.listen(config.ServerSettings?.ServerPort);
    console.log(`Socket.io server listening on port ${+config.ServerSettings?.ServerPort}`);
}