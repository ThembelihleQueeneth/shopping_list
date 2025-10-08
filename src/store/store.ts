import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "../features/register_slice/RegisterSlice";
import loginReducer from "../features/login_slice/LoginSlice";
import listReducer from '../features/list_slice/listSlice';

const persistedLoginState = localStorage.getItem("loginState")
  ? JSON.parse(localStorage.getItem("loginState")!)
  : undefined;

export const store = configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer,
    lists: listReducer,
  },
  preloadedState: {
    login: persistedLoginState,
  },
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("loginState", JSON.stringify(state.login));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
