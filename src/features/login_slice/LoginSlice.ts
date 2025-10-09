import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
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

const storedUser = localStorage.getItem("user");

const initialState: LoginState = {
  loading: false,
  error: null,
  isAuthenticated: storedUser ? true : false,
  user: storedUser ? JSON.parse(storedUser) : null,
};

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("http://localhost:3000/users", {
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

      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateUserInDB = createAsyncThunk(
  "login/updateUserInDB",
  async ({ id, data }: { id: number; data: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://localhost:3000/users/${id}`, data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
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
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserInDB.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInDB.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserInDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
