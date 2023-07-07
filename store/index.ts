import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import gatewayReducer from './reducers/gateways';

const rootReducer = combineReducers({
    gateways: gatewayReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
