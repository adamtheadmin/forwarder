import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import Ajv, {ErrorObject} from 'ajv';
import {Config} from "../@types/Config";

let cachedConfig: Config | undefined;

const schema = {
    type: 'object',
    properties: {
        Name: { type: 'string' },
        Type: { type: 'string' },
        SecretKey: { type: 'string' },
        ServerSettings: {
            type: 'object',
            properties: {
                ServerPort: { type: 'number' }
            },
            required: ['ServerPort']
        },
        ClientSettings: {
            type: 'object',
            properties: {
                ServerUrl: { type: 'string' }
            },
            required: ['ServerUrl']
        },
        PortForwards: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    Name: { type: 'string' },
                    LocalPort: { type: 'number' },
                    ForwardTo: { type: 'string' },
                    RemotePort: { type: 'number' },
                    RemoteHost: { type: 'string' },
                },
                required: ['Name', 'LocalPort', 'ForwardTo', 'RemotePort']
            }
        }
    },
    required: ['Name', 'Type', 'SecretKey', 'ServerSettings', 'ClientSettings', 'PortForwards']
};

export default function configParser(): Config {
    if (cachedConfig !== undefined) {
        return cachedConfig;
    }

    const ajv = new Ajv();
    const validate = ajv.compile(schema);

    const doc: any = yaml.load(fs.readFileSync(path.resolve(__dirname, '../config.yml'), 'utf8'));
    const valid = validate(doc);

    if (!valid && validate.errors) {
        console.error(`Error: There was a problem with the config.yml file: ${validate.errors.map((e: ErrorObject) => e.message).join(', ')}`);
        process.exit(1);
    }

    cachedConfig = doc as Config;
    return cachedConfig;
}