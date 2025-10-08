import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "../features/register_slice/RegisterSlice";
import loginReducer from "../features/login_slice/LoginSlice";

// Load persisted state from localStorage
const persistedLoginState = localStorage.getItem("loginState")
  ? JSON.parse(localStorage.getItem("loginState")!)
  : undefined;

export const store = configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer,
  },
  preloadedState: {
    login: persistedLoginState,
  },
});

// Save login state on every change
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("loginState", JSON.stringify(state.login));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
