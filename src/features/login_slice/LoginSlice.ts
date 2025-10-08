import { createSlice, createAsyncThunk,  type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id?: number;
  name?: string;
  surname?: string;
  email: string;
  password: string;
  cellphone?: string;
}

interface LoginState {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: LoginState = {
  loading: false,
  error: null,
  isAuthenticated: false,
  user: null,
};

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("http://localhost:5000/users", {
        params: { email },
      });

      const users = response.data;

      if (users.length === 0) {
        return rejectWithValue("User not found");
      }

      const user = users[0];

      if (user.password !== password) {
        return rejectWithValue("Invalid password");
      }

      return user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateUser } = loginSlice.actions;
export default loginSlice.reducer;
