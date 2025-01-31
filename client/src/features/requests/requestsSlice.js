// src/features/requests/requestsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    requests: [],
    status: 'idle',
    error: null
};

const requestsSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        // Добавьте редьюсеры при необходимости
    },
    // Добавьте extraReducers если будете использовать асинхронные операции
});

export default requestsSlice.reducer;