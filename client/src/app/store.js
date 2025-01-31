import { configureStore } from '@reduxjs/toolkit';
import propertiesReducer from '../features/properties/propertiesSlice';
import requestsReducer from '../features/requests/requestsSlice';

export const store = configureStore({
    reducer: {
        properties: propertiesReducer,
        requests: requestsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});