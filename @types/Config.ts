export interface Config {
    Name:           string;
    Type:           'client'|'server';
    SecretKey:      string;
    ServerSettings: ServerSettings;
    ClientSettings: ClientSettings;
    PortForwards:   PortForward[];
}

export interface ClientSettings {
    ServerUrl: string;
}

export interface PortForward {
    Name:       string;
    LocalPort:  number;
    ForwardTo:  string;
    RemotePort: number;
    RemoteHost: string;
}

export interface ServerSettings {
    ServerPort: number;
}
