import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface RegisterPayload {
  name: string;
  surname: string;
  email: string;
  cellphone: string;
  password: string;
}

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
};

// Async thunk (simulating API call)
export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      // Simulate API request
      const response = await new Promise<{ message: string }>((resolve) =>
        setTimeout(() => resolve({ message: "User registered successfully!" }), 1500)
      );
      return response.message;
    } catch (error) {
      return rejectWithValue("Failed to register user.");
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
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default registerSlice.reducer;
