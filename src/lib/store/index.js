import { configureStore } from '@reduxjs/toolkit';
import rootReducers from '../rootReducer.js';

export const store = configureStore({
    reducer: rootReducers,
});

