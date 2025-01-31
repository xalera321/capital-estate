import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/propertyService';

export const fetchProperties = createAsyncThunk(
    'properties/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            return await api.getProperties(params);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const propertiesSlice = createSlice({
    name: 'properties',
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export default propertiesSlice.reducer;