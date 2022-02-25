import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from '../reducer/canvasSlice';

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
  },
});
