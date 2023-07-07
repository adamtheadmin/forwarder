# Forwarder

## Description

Forwarder is a Node.js application written in TypeScript designed to handle port forwarding through WebSockets. This powerful tool creates a system that receives incoming connections and forwards them to remote servers while also maintaining active connections and data transfer.

## Features

- Proxy Events: Handles data forwarding events.
- Port Forwarding: Listens to specific ports and forwards incoming traffic.
- Active Connections: Handles connection establishment, data transfer, and disconnection.

## Installation

To use the Forwarder, first, clone this repository by running the command:

```
git clone git@github.com:adamtheadmin/forwarder.git
```

Navigate into the cloned repository:

```
cd forwarder
```

Then, install the dependencies using either npm or yarn:

With npm:

```
npm install
```

With yarn:

```
yarn install
```

The project is written in TypeScript, You can run type checking by using this command

With npm:

```
npx tsc
```

This will compile the TypeScript files into JavaScript files in the 'dist' directory.

## Usage

To run the application, execute the following command:

With npm:

```
npm start
```

Before running the application, ensure to modify the configuration file to specify the port forwarding settings.

## Configuration

The application's behavior can be configured by modifying the settings in the `config.yml` file. This includes settings for the PortForwards such as `LocalPort`, `RemotePort`, `ForwardTo`, and `Name`.

## Contributions

We welcome contributions from the community. If you wish to contribute, just make a PR!

## License

MIT License

Copyright (c) 2023 Adam Fowler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contact

If you have any questions or issues, please open an issue on this repository, and we will do our best to address it in a timely manner.

---

Happy Forwarding!
