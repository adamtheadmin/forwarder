import configParser from '../src/configParser';
import {handleIncomingConnections, ProxyEvents} from "./ProxyEvents";
import io from "socket.io-client";
import bcrypt from "./bcrypt";
export default function CreateClient() {
    const config = configParser();
    const socket = io(config?.ClientSettings?.ServerUrl);

    socket.on("connect", async ():Promise<void> => {
        socket.emit('register', {
            name: config.Name,
            socketId: socket.id,
            password: (await bcrypt.hashPassword(config?.SecretKey))
        });
        // @ts-ignore
        ProxyEvents(socket);
    });
    handleIncomingConnections(socket);
}