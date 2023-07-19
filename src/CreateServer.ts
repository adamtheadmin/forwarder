import { createServer } from "http";
import {Server, Socket} from "socket.io";
import {store} from "../store";
import {connect, disconnect} from "../store/reducers/gateways";
import configParser from '../src/configParser';
import {handleIncomingConnections, ProxyEvents} from "./ProxyEvents";
import bcrypt from "./bcrypt";

export default function CreateServer() {
    const config = configParser();

    const httpServer = createServer();
    const io = new Server(httpServer, {});

    io.on("connection", (socket: Socket) => {
        socket.on('register', async (data: any) => {
            if (!(await bcrypt.comparePassword(config?.SecretKey, data.password))) {
                console.error("Could not authenticate socket");
                return;
            }
            console.log('Socket Authenticated!', data);
            // @ts-ignore
            store.dispatch(connect({
                name: data.name,
                socketId: socket.id
            }));

            const gateways = store.getState().gateways;
        });

        socket.on("disconnect", () => {
            console.log("socket disconnected");
            // @ts-ignore
            store.dispatch(disconnect({socketId: socket.id}));
            const gateways = store.getState().gateways;
        });

        socket.on('error', (err) => {
            console.error('Socket IO Error:', err);
        });

        ProxyEvents(socket);
    });

    handleIncomingConnections(io);

    httpServer.listen(config.ServerSettings?.ServerPort);
}