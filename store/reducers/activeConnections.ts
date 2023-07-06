import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { ActiveConnection } from '../../@types/state/ActiveConnection';
import * as net from 'net';

const initialState: ActiveConnection[] = [];

export const activeConnectionsSlice = createSlice({
    name: 'activeConnections',
    initialState,
    reducers: {
        create: (state, action: any) => {
            const client = new net.Socket();
            client.connect(action.remotePort, action.remoteHost);
            client.on('data', (response) => {
                action.socket.emit('response', { sessionId: action.sessionId, data: response });
            });
            state.push({
                client: client,
                sessionId: action.sessionId,
                name: action.name
            });
        },
        write: (state, action: any) => {
            const connection = state.find((connection: ActiveConnection) => connection.sessionId === action.sessionId);
            if (connection) {
                const buffer:Buffer = Buffer.from(action.data, 'base64');
                connection.client.write(buffer);
            }
        },

        end: (state, action: any) => {
            const index = state.findIndex(conn => conn.sessionId === action.sessionId);
            if (index !== -1) {
                state[index].client.destroy();
                state.splice(index, 1);
            }
        }
    }
});

export const { create, write, end } = activeConnectionsSlice.actions;

export const selectActiveConnections = (state: RootState) => state.activeConnections;

export default activeConnectionsSlice.reducer;
