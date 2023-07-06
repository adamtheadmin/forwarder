import configParser from '../src/configParser';
import {handleIncomingConnections, ProxyEvents} from "./ProxyEvents";
import io from "socket.io-client";
export default function CreateClient() {
    const config = configParser();
    const socket = io(config?.ClientSettings?.ServerUrl);

    socket.on("connect", ():void => {
        socket.emit('register', {
            name: config.Name,
            socketId: socket.id
        });
        // @ts-ignore
        ProxyEvents(socket);
    });
    handleIncomingConnections(socket);
}