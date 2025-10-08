import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  completed: boolean;
  listId: string;
  notes?: string;
  image?: string; // URL or base64 string for the image
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

// Slice state interface
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

// Fetch items for a specific list
export const fetchListItems = createAsyncThunk(
  "lists/fetchListItems",
  async (listId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<List>(`${API_URL}/lists/${listId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch list items");
    }
  }
);

// Add grocery item to a list
export const addGroceryItem = createAsyncThunk(
  "lists/addGroceryItem",
  async (payload: { 
    name: string; 
    quantity: number; 
    listId: string;
    category?: string;
  }, { rejectWithValue }) => {
    try {
      const newItem: Omit<GroceryItem, "id"> = {
        name: payload.name,
        quantity: payload.quantity,
        category: payload.category || "Uncategorized",
        completed: false,
        listId: payload.listId,
      };
      
      // First, get the current list
      const listResponse = await axios.get<List>(`${API_URL}/lists/${payload.listId}`);
      const list = listResponse.data;
      
      // Create the new item with an ID
      const itemWithId: GroceryItem = {
        ...newItem,
        id: Date.now().toString(),
      };
      
      // Update the list with the new item
      const updatedList = {
        ...list,
        groceryItems: [...(list.groceryItems || []), itemWithId],
        items: (list.groceryItems?.length || 0) + 1,
      };
      
      // Save the updated list back to the server
      const response = await axios.put<List>(`${API_URL}/lists/${payload.listId}`, updatedList);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add grocery item");
    }
  }
);

// Update grocery item
export const updateGroceryItem = createAsyncThunk(
  "lists/updateGroceryItem",
  async (payload: {
    listId: string;
    itemId: string;
    updates: Partial<GroceryItem>;
  }, { rejectWithValue }) => {
    try {
      // First, get the current list
      const listResponse = await axios.get<List>(`${API_URL}/lists/${payload.listId}`);
      const list = listResponse.data;
      
      // Update the specific item
      const updatedGroceryItems = list.groceryItems.map(item => 
        item.id === payload.itemId 
          ? { ...item, ...payload.updates }
          : item
      );
      
      // Update the list with modified items
      const updatedList = {
        ...list,
        groceryItems: updatedGroceryItems,
      };
      
      // Save the updated list back to the server
      const response = await axios.put<List>(`${API_URL}/lists/${payload.listId}`, updatedList);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update grocery item");
    }
  }
);

// Delete grocery item
export const deleteGroceryItem = createAsyncThunk(
  "lists/deleteGroceryItem",
  async (payload: {
    listId: string;
    itemId: string;
  }, { rejectWithValue }) => {
    try {
      // First, get the current list
      const listResponse = await axios.get<List>(`${API_URL}/lists/${payload.listId}`);
      const list = listResponse.data;
      
      // Remove the item from the list
      const updatedGroceryItems = list.groceryItems.filter(item => 
        item.id !== payload.itemId
      );
      
      // Update the list with remaining items
      const updatedList = {
        ...list,
        groceryItems: updatedGroceryItems,
        items: updatedGroceryItems.length,
      };
      
      // Save the updated list back to the server
      const response = await axios.put<List>(`${API_URL}/lists/${payload.listId}`, updatedList);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete grocery item");
    }
  }
);

// Slice
export const listSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    // Sync reducers for immediate UI updates (optional)
    toggleGroceryItemComplete: (state, action: PayloadAction<{ listId: string; itemId: string }>) => {
      const list = state.lists.find(list => list.id === action.payload.listId);
      if (list && list.groceryItems) {
        const item = list.groceryItems.find(item => item.id === action.payload.itemId);
        if (item) {
          item.completed = !item.completed;
        }
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
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
      })
      
      // Fetch List Items
      .addCase(fetchListItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListItems.fulfilled, (state, action: PayloadAction<List>) => {
        state.loading = false;
        // Update the specific list in the state
        const index = state.lists.findIndex(list => list.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        } else {
          state.lists.push(action.payload);
        }
      })
      .addCase(fetchListItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add Grocery Item
      .addCase(addGroceryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGroceryItem.fulfilled, (state, action: PayloadAction<List>) => {
        state.loading = false;
        // Update the list in state
        const index = state.lists.findIndex(list => list.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })
      .addCase(addGroceryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Grocery Item
      .addCase(updateGroceryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroceryItem.fulfilled, (state, action: PayloadAction<List>) => {
        state.loading = false;
        // Update the list in state
        const index = state.lists.findIndex(list => list.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })
      .addCase(updateGroceryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Grocery Item
      .addCase(deleteGroceryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroceryItem.fulfilled, (state, action: PayloadAction<List>) => {
        state.loading = false;
        // Update the list in state
        const index = state.lists.findIndex(list => list.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })
      .addCase(deleteGroceryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  toggleGroceryItemComplete,
  clearError 
} = listSlice.actions;

export default listSlice.reducer;