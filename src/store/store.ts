import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    //To be added
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
