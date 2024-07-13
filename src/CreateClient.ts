import configParser from '../src/configParser';
import {handleIncomingConnections, ProxyEvents} from "./ProxyEvents";
import io from "socket.io-client";
import bcrypt from "./bcrypt";

export default async function CreateClient() {
    const config = configParser();

    if (!config?.ClientSettings?.ServerUrl) {
        throw new Error("ServerUrl is not defined in the configuration");
    }
    if (!config?.SecretKey) {
        throw new Error("SecretKey is not defined in the configuration");
    }

    console.log(`Client Starting... Connecting to host at ${config.ClientSettings.ServerUrl}`);

    const socket = io(config.ClientSettings.ServerUrl, {
        transports: ['websocket', 'polling']
    });

    socket.on("connect", async () => {
        console.log("Connected to io server");
        socket.emit('register', {
            name: config.Name,
            socketId: socket.id,
            password: await bcrypt.hashPassword(config.SecretKey)
        });
        console.log("Registered with io server");
        ProxyEvents(socket);
    });

    socket.on("connect_error", (err) => {
        console.error("Connection error:", err);
        console.error("Error details:", err.description);
    });

    socket.io.on("error", (err) => {
        console.error("Socket.IO error:", err);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
        console.log(`Attempting reconnection (${attempt})`);
    });

    socket.on("disconnect", (reason) => {
        console.log(`Disconnected: ${reason}`);
    });

    handleIncomingConnections(socket);
}
