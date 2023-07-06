import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Server } from '../../@types/state/Server';
import net from 'net';

const initialState: Server[] = [];

export const servers = createSlice({
    name: 'servers',
    initialState,
    reducers: {
        create: (state, action: any) => {
            state.push({
                server: action.server,
                sessionId: action.sessionId
            });
        },
        write: (state, action: any) => {
            const server = state.find((server: Server) => server.sessionId === action.sessionId);
            if (server) {
                server.server.write(action.data);
            }
        },
        end: (state, action: any) => {
            const index = state.findIndex(conn => conn.sessionId === action.sessionId);
            if (index !== -1) {
                state[index].server.end();
                state.splice(index, 1);
            }
        }
    }
});

export const { create, write, end } = servers.actions;

export const selectServers = (state: RootState) => state.servers;

export default servers.reducer;
