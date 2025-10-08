import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "../features/register_slice/RegisterSlice";
import loginReducer from "../features/login_slice/LoginSlice"; // 👈 import login slice

export const store = configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer, // 👈 add login slice here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
