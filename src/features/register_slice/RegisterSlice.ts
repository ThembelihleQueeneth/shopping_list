import { createSlice, createAsyncThunk,  } from '@reduxjs/toolkit';


interface RegisterData {
  id?:string;
  name: string;
  surname: string;
  email: string;
  cellphone: string;
  password: string;
}

interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
};

export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (userData: RegisterData, ) => {
   
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Registration failed');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error || 'Network error');
    }
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetRegister: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
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
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearError, resetRegister } = registerSlice.actions;
export default registerSlice.reducer;