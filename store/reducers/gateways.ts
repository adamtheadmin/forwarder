import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Gateway } from '../../@types/state/Gateway';

const initialState:Gateway[] = [];

export const gatewaySlice = createSlice({
    name: 'gateway',
    initialState,
    reducers: {
        connect: (state, action: any) => {
            state.push(action);
        },
        disconnect: (state, action: any) => {
            const index = state.findIndex((gateway: Gateway) => gateway.socketId === action.socketId);
            if (index !== -1) {
                state.splice(index, 1);
            }
        }
    }
});

export const { connect, disconnect } = gatewaySlice.actions;

export const selectGateways = (state: RootState) => state.gateways;

export default gatewaySlice.reducer;
