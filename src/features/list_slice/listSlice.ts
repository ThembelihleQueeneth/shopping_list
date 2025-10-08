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

interface ListState {
  lists: List[];
  loading: boolean;
  error: string | null;
}

const initialState: ListState = {
  lists: [],
  loading: false,
  error: null,
};

// Fetch all lists for a specific user
export const fetchUserLists = createAsyncThunk(
  "lists/fetchUserLists", 
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/lists?userId=${userId}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch all lists (admin/global view)
export const fetchLists = createAsyncThunk("lists/fetchLists", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("http://localhost:3000/lists");
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// Add a new list for a user
export const addList = createAsyncThunk(
  "lists/addList", 
  async ({ name, userId }: { name: string; userId: string }, { rejectWithValue }) => {
    try {
      const newList: List = {
        id: Math.random().toString(36).substr(2, 9), // Generate unique ID
        name,
        items: 0,
        date: new Date().toLocaleDateString(),
        userId,
        groceryItems: [],
      };
      const response = await axios.post("http://localhost:3000/lists", newList);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete a list
export const deleteList = createAsyncThunk(
  "lists/deleteList", 
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/lists/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Add item to a list
export const addItemToList = createAsyncThunk(
  "lists/addItemToList",
  async ({ 
    listId, 
    itemName, 
    quantity = 1, 
    category = "Other" 
  }: { 
    listId: string; 
    itemName: string;
    quantity?: number;
    category?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/lists/${listId}`);
      const list: List = response.data;

      const newItem: GroceryItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: itemName,
        quantity,
        category,
        completed: false,
      };

      const updatedList: List = {
        ...list,
        items: list.items + 1,
        groceryItems: [...list.groceryItems, newItem],
      };

      await axios.put(`http://localhost:3000/lists/${listId}`, updatedList);
      return updatedList;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Update item completion status
export const toggleItemCompletion = createAsyncThunk(
  "lists/toggleItemCompletion",
  async ({ 
    listId, 
    itemId 
  }: { 
    listId: string; 
    itemId: string;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/lists/${listId}`);
      const list: List = response.data;

      const updatedList: List = {
        ...list,
        groceryItems: list.groceryItems.map(item =>
          item.id === itemId 
            ? { ...item, completed: !item.completed }
            : item
        ),
      };

      await axios.put(`http://localhost:3000/lists/${listId}`, updatedList);
      return updatedList;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Remove item from list
export const removeItemFromList = createAsyncThunk(
  "lists/removeItemFromList",
  async ({ 
    listId, 
    itemId 
  }: { 
    listId: string; 
    itemId: string;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/lists/${listId}`);
      const list: List = response.data;

      const updatedList: List = {
        ...list,
        items: list.items - 1,
        groceryItems: list.groceryItems.filter(item => item.id !== itemId),
      };

      await axios.put(`http://localhost:3000/lists/${listId}`, updatedList);
      return updatedList;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const listSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    clearLists: (state) => {
      state.lists = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Lists
      .addCase(fetchLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action: PayloadAction<List[]>) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Lists
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
        state.lists = state.lists.filter((list) => list.id !== action.payload);
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Item to List
      .addCase(addItemToList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToList.fulfilled, (state, action: PayloadAction<List>) => {
        state.loading = false;
        state.lists = state.lists.map((list) =>
          list.id === action.payload.id ? action.payload : list
        );
      })
      .addCase(addItemToList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle Item Completion
      .addCase(toggleItemCompletion.fulfilled, (state, action: PayloadAction<List>) => {
        state.lists = state.lists.map((list) =>
          list.id === action.payload.id ? action.payload : list
        );
      })
      // Remove Item from List
      .addCase(removeItemFromList.fulfilled, (state, action: PayloadAction<List>) => {
        state.lists = state.lists.map((list) =>
          list.id === action.payload.id ? action.payload : list
        );
      });
  },
});

export const { clearLists, clearError } = listSlice.actions;
export default listSlice.reducer;