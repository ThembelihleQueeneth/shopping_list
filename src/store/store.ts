import { configureStore } from '@reduxjs/toolkit';
import registerReducer

export const store = configureStore({
  reducer: {
    register: registerReducer,
    // other reducers...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;