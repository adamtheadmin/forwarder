import configParser from './src/configParser';
import CreateServer from "./src/CreateServer";
import CreateClient from "./src/CreateClient";

const config = configParser();
switch(config?.Type) {
    case "server":
        CreateServer();
        break;

    case "client":
        CreateClient();
        break;

    default:
        console.error(`Unsupported 'Type' value: ${config?.Type}. Please set it to either 'server' or 'client'`)
}