import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  completed: boolean;
}

export interface List {
  id: string;
  name: string;
  items: number;
  date: string;
  userId: string;
  groceryItems: GroceryItem[];
}

// Base URL for json-server
const API_URL = "http://localhost:3000"; // adjust if needed

// Fetch lists for a specific user
export const fetchUserLists = createAsyncThunk(
  "lists/fetchUserLists",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<List[]>(`${API_URL}/lists?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch lists");
    }
  }
);

// Add a new list
export const addList = createAsyncThunk(
  "lists/addList",
  async (payload: { name: string; userId: string }, { rejectWithValue }) => {
    try {
      const newList: Omit<List, "id"> = {
        name: payload.name,
        userId: payload.userId,
        items: 0,
        date: new Date().toLocaleDateString(),
        groceryItems: [],
      };
      const response = await axios.post<List>(`${API_URL}/lists`, newList);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add list");
    }
  }
);

// Delete a list by ID
export const deleteList = createAsyncThunk(
  "lists/deleteList",
  async (listId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/lists/${listId}`);
      return listId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete list");
    }
  }
);

// Slice
interface ListsState {
  lists: List[];
  loading: boolean;
  error: string | null;
}

const initialState: ListsState = {
  lists: [],
  loading: false,
  error: null,
};

export const listSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Lists
      .addCase(fetchUserLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLists.fulfilled, (state, action: PayloadAction<List[]>) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchUserLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add List
      .addCase(addList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addList.fulfilled, (state, action: PayloadAction<List>) => {
        state.loading = false;
        state.lists.push(action.payload);
      })
      .addCase(addList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete List
      .addCase(deleteList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteList.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.lists = state.lists.filter(list => list.id !== action.payload);
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default listSlice.reducer;
