import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import gatewayReducer from './reducers/gateways';
import activeConnections from "./reducers/activeConnections";
import servers from './reducers/servers'

const rootReducer = combineReducers({
    gateways: gatewayReducer,
    activeConnections: activeConnections,
    servers: servers
});

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
