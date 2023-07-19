import configParser from '../src/configParser';
import {handleIncomingConnections, ProxyEvents} from "./ProxyEvents";
import io from "socket.io-client";
import bcrypt from "./bcrypt";
export default function CreateClient() {
    const config = configParser();
    console.log(`Client Starting... Connecting to host at ${config?.ClientSettings?.ServerUrl}`);
    const socket = io(config?.ClientSettings?.ServerUrl);

    socket.on("connect", async ():Promise<void> => {
        console.log("Connected to io server");
        socket.emit('register', {
            name: config.Name,
            socketId: socket.id,
            password: (await bcrypt.hashPassword(config?.SecretKey))
        });
        console.log("Registered with io server");
        // @ts-ignore
        ProxyEvents(socket);
    });
    handleIncomingConnections(socket);
}