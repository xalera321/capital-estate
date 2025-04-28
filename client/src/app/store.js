import { configureStore } from '@reduxjs/toolkit';
import propertiesReducer from '../features/properties/propertiesSlice';
import requestsReducer from '../features/requests/requestsSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';

export const store = configureStore({
    reducer: {
        properties: propertiesReducer,
        requests: requestsReducer,
        favorites: favoritesReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});