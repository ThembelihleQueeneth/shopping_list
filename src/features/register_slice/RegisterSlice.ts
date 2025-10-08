import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  id?: number;
  name: string;
  surname: string;
  email: string;
  cellphone: string;
  password: string;
}

interface RegisterState {
  loading: boolean;
  error: string | null;
}

const initialState: RegisterState = {
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (userData: User, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/users", userData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default registerSlice.reducer;
